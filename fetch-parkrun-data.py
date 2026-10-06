#!/usr/bin/env python3
import requests
from bs4 import BeautifulSoup
import json
import math

ATHLETES = {'lisa': 'a3934942', 'beth': 'a2475659'}
FLAT = {'lat': 51.5045, 'lng': -0.2226}
WORK = {'lat': 51.5202, 'lng': -0.0982}

def haversine(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    a = math.sin(delta_phi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def fetch_athlete_data(athlete_id):
    url = f'https://www.parkrun.org.uk/athlete/{athlete_id}/'
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error: {e}")
        return None
    
    soup = BeautifulSoup(response.content, 'html.parser')
    courses = []
    table = soup.find('table', {'class': 'sortable'})
    if not table:
        return None
    
    for row in table.find_all('tr')[1:]:
        cols = row.find_all('td')
        if len(cols) < 5:
            continue
        try:
            date_str = cols[0].text.strip()
            course_name = cols[1].text.strip()
            location = cols[2].text.strip()
            letter = course_name[0].upper() if course_name else '?'
            
            location_link = cols[2].find('a')
            lat, lng = None, None
            if location_link:
                for attr in ['data-latitude', 'data-lat']:
                    if location_link.get(attr):
                        lat = float(location_link.get(attr))
                        lng = float(location_link.get('data-longitude') or location_link.get('data-lng'))
                        break
            
            if not lat or not lng:
                continue
            
            dist_flat = haversine(lat, lng, FLAT['lat'], FLAT['lng'])
            dist_work = haversine(lat, lng, WORK['lat'], WORK['lng'])
            courses.append({
                'name': course_name,
                'letter': letter,
                'date': date_str,
                'lat': lat,
                'lng': lng,
                'location': location,
                'distances': {'toFlat': dist_flat, 'toWork': dist_work}
            })
        except:
            continue
    
    return courses

def main():
    data = {}
    for name, athlete_id in ATHLETES.items():
        print(f"Fetching {name}...")
        courses = fetch_athlete_data(athlete_id)
        if courses is None:
            try:
                with open('parkrun-data.json', 'r') as f:
                    existing = json.load(f)
                    data[name] = existing.get(name, {'athleteId': athlete_id, 'name': name.capitalize(), 'courses': []})
            except:
                data[name] = {'athleteId': athlete_id, 'name': name.capitalize(), 'courses': []}
        else:
            data[name] = {'athleteId': athlete_id, 'name': name.capitalize(), 'courses': courses}
            print(f"Found {len(courses)} runs for {name}")
    
    with open('parkrun-data.json', 'w') as f:
        json.dump(data, f, indent=2)
    print("Saved to parkrun-data.json")

if __name__ == '__main__':
    main()
