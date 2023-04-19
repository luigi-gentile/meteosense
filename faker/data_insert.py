from datetime import datetime, timedelta, date
from faker import Faker
import pymongo

client = pymongo.MongoClient('mongodb+srv://admin:admin@mascoloproject.vbu3vx4.mongodb.net/?retryWrites=true&w=majority')
db = client.test
sensors_collection = db.sensors

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)

def generate_reading(previous_values, max_variation):
    reading = {
        'timestamp': None,
        'temperature': None,
        'humidity': None,
        'pressure': None
    }
    if previous_values:
        reading['timestamp'] = previous_values['timestamp'] + timedelta(hours=1)
        reading['temperature'] = round(max(min(previous_values['temperature'] + fake.pyfloat(min_value=-max_variation, max_value=max_variation, right_digits=2), 30), 10), 1)
        reading['humidity'] = round(max(min(previous_values['humidity'] + fake.pyfloat(min_value=-max_variation, max_value=max_variation, right_digits=2), 70), 40), 1)
        reading['pressure'] = round(max(min(previous_values['pressure'] + fake.pyfloat(min_value=-max_variation, max_value=max_variation, right_digits=2), 1100), 900), 1)
    else:
        reading['timestamp'] = datetime.now()
        reading['temperature'] = round(float(fake.pyfloat(min_value=10, max_value=30, right_digits=2)), 1)
        reading['humidity'] = round(float(fake.pyfloat(min_value=40, max_value=70, right_digits=2)), 1)
        reading['pressure'] = round(float(fake.pyfloat(min_value=900, max_value=1100, right_digits=2)), 1)
    return reading

# Generazione dei dati fittizi
fake = Faker()
sensors = []
start_date = datetime(2023, 3, 1).date()
end_date = datetime(2023, 3, 31).date()
for i in range(5):
    sensor = {
        'id': fake.uuid4(),
        'name': fake.company(),
        'location': {
            'type': 'Point',
            'coordinates': [float(fake.longitude()), float(fake.latitude())]
        },
        'readings': []
    }
    previous_values = None
    for date in daterange(start_date, end_date):
        timestamp = datetime.combine(date, datetime.min.time())
        for j in range(24):
            reading = generate_reading(previous_values, 1.0)
            reading['timestamp'] = timestamp + timedelta(hours=j)
            sensor['readings'].append(reading)
            previous_values = reading
        previous_values = None
    sensors.append(sensor)

# Salvataggio dei dati fittizi nel database
result = sensors_collection.insert_many(sensors)
print('Dati fittizi salvati con successo:', result.inserted_ids)