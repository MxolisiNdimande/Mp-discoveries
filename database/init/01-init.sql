-- database/init/01-init.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Destinations table
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    country VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0.0,
    category VARCHAR(100),
    avg_cost VARCHAR(100),
    best_time VARCHAR(100),
    has_animal_tracking BOOLEAN DEFAULT false,
    views INTEGER DEFAULT 0,
    scans INTEGER DEFAULT 0,
    emails_sent INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Animal sightings table
CREATE TABLE animal_sightings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    species VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    gate VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    count INTEGER DEFAULT 1,
    confidence INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    image_url VARCHAR(500),
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accommodations table
CREATE TABLE accommodations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 0.0,
    price_per_night VARCHAR(100),
    amenities TEXT[], -- Array of amenities
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    contact_website VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Destination-Accommodation relationship
CREATE TABLE destination_accommodations (
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    accommodation_id UUID REFERENCES accommodations(id) ON DELETE CASCADE,
    PRIMARY KEY (destination_id, accommodation_id)
);

-- Flights table
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_number VARCHAR(20) NOT NULL,
    airline VARCHAR(100) NOT NULL,
    origin_code VARCHAR(3) NOT NULL,
    destination_code VARCHAR(3) NOT NULL,
    origin_city VARCHAR(100),
    destination_city VARCHAR(100),
    departure_time TIME NOT NULL,
    arrival_time TIME NOT NULL,
    duration VARCHAR(20),
    status VARCHAR(50) DEFAULT 'scheduled',
    gate VARCHAR(10),
    price DECIMAL(10,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users table (staff and admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'staff', -- 'admin', 'kruger_staff', 'advertiser'
    status VARCHAR(50) DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table for tracking interactions
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id VARCHAR(100),
    session_id VARCHAR(255),
    interaction_type VARCHAR(100) NOT NULL, -- 'view', 'scan', 'email', 'booking'
    destination_id UUID REFERENCES destinations(id),
    accommodation_id UUID REFERENCES accommodations(id),
    flight_id UUID REFERENCES flights(id),
    user_data JSONB, -- Flexible user data storage
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    advertiser VARCHAR(255),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'draft', -- 'active', 'paused', 'completed'
    budget DECIMAL(10,2),
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Device monitoring table
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'interactive_kiosk', 'digital_signage'
    location VARCHAR(255) NOT NULL,
    terminal VARCHAR(10),
    status VARCHAR(50) DEFAULT 'offline', -- 'online', 'offline', 'maintenance'
    ip_address INET,
    last_active TIMESTAMP WITH TIME ZONE,
    interactions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO destinations (id, name, country, description, image_url, rating, category, avg_cost, best_time, has_animal_tracking) VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Kruger National Park',
    'South Africa',
    'One of Africa''s largest game reserves with high density of wild animals including the Big 5.',
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800',
    4.8,
    'Wildlife & Nature',
    'R2,500 - R8,000',
    'May - September',
    true
),
(
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
    'Blyde River Canyon',
    'South Africa',
    'A spectacular natural landmark with dramatic scenery, waterfalls, and panoramic views.',
    'https://images.unsplash.com/photo-1574784912348-5c1d915b0f6c?w=800',
    4.7,
    'Nature & Scenery',
    'R1,200 - R4,000',
    'March - October',
    false
);

INSERT INTO animal_sightings (species, location, gate, latitude, longitude, count, confidence, status, image_url) VALUES
(
    'African Lion',
    'Skukuza Rest Camp Area',
    'Paul Kruger Gate',
    -24.9947,
    31.5972,
    3,
    95,
    'recent',
    'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400'
),
(
    'African Elephant',
    'Lower Sabie River',
    'Crocodile Bridge',
    -25.1256,
    31.9853,
    12,
    98,
    'active',
    'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400'
);

INSERT INTO accommodations (name, type, location, description, image_url, rating, price_per_night, amenities, contact_phone, contact_email) VALUES
(
    'Singita Lebombo Lodge',
    'lodge',
    'Kruger National Park',
    'Luxury lodge perched on the cliffs overlooking the N''wanetsi River with stunning views and exclusive safari experiences.',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    4.9,
    'R12,500',
    '{"Swimming Pool", "Spa", "Fine Dining", "Game Drives", "WiFi", "Air Conditioning"}',
    '+27 13 735 5500',
    'reservations@singita.com'
);

-- Link accommodations to destinations
INSERT INTO destination_accommodations (destination_id, accommodation_id) VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    (SELECT id FROM accommodations WHERE name = 'Singita Lebombo Lodge')
);

INSERT INTO users (email, name, password_hash, role) VALUES
(
    'admin@gatewaydiscoveries.com',
    'System Administrator',
    '$2b$10$ExampleHashForDemoPurposesOnly', -- In production, use proper hashing
    'admin'
),
(
    'ranger@kruger.co.za',
    'Kruger Park Ranger',
    '$2b$10$ExampleHashForDemoPurposesOnly',
    'kruger_staff'
);

-- Create indexes for better performance
CREATE INDEX idx_animal_sightings_status ON animal_sightings(status);
CREATE INDEX idx_animal_sightings_reported ON animal_sightings(reported_at);
CREATE INDEX idx_analytics_created ON analytics(created_at);
CREATE INDEX idx_analytics_type ON analytics(interaction_type);
CREATE INDEX idx_flights_route ON flights(origin_code, destination_code);
CREATE INDEX idx_destinations_category ON destinations(category);