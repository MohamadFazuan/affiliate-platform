-- Re-seed products with updated images (users already exist)

-- Sample products with realistic affiliate data and picsum.photos images
INSERT INTO products (id, name, category, platform, commission, price, avg_monthly_sales, conversion_rate, competition_level, target_age_min, target_age_max, target_gender, target_location, interest_tags, refund_rate, rating, trend_score, estimated_cpc, estimated_traffic, potential_score, image_url)
VALUES
('prod_001', 'Smart Fitness Tracker Pro', 'Electronics', 'TikTok Shop', 15.0, 79.99, 2500, 0.035, 'Medium', 18, 45, 'All', 'Global', 'fitness,health,technology', 0.08, 4.5, 85, 1.2, 50000, 892.5, 'https://picsum.photos/500/400'),
('prod_002', 'Organic Skincare Set', 'Beauty', 'Shopee', 20.0, 49.99, 3200, 0.042, 'High', 20, 35, 'Female', 'Asia', 'skincare,beauty,organic', 0.12, 4.3, 92, 0.8, 75000, 1075.2, 'https://picsum.photos/500/400'),
('prod_003', 'Gaming Mechanical Keyboard', 'Electronics', 'Amazon', 12.0, 129.99, 1800, 0.028, 'Low', 16, 30, 'Male', 'Global', 'gaming,technology', 0.05, 4.7, 78, 1.5, 35000, 623.4, 'https://picsum.photos/500/400'),
('prod_004', 'Portable Blender', 'Kitchen', 'TikTok Shop', 25.0, 34.99, 4500, 0.048, 'Medium', 20, 50, 'All', 'Global', 'kitchen,health,fitness', 0.15, 4.1, 88, 0.6, 90000, 1458.0, 'https://picsum.photos/500/400'),
('prod_005', 'Minimalist Watch Collection', 'Fashion', 'Shopee', 18.0, 89.99, 2100, 0.032, 'Medium', 22, 40, 'All', 'Global', 'fashion,luxury,accessories', 0.10, 4.4, 80, 1.0, 45000, 765.6, 'https://picsum.photos/500/400'),
('prod_006', 'LED Ring Light Kit', 'Photography', 'Amazon', 22.0, 59.99, 2800, 0.038, 'Low', 18, 35, 'All', 'Global', 'photography,content-creation', 0.07, 4.6, 87, 0.9, 55000, 982.8, 'https://picsum.photos/500/400'),
('prod_007', 'Yoga Mat Premium', 'Sports', 'TikTok Shop', 30.0, 45.99, 3500, 0.045, 'High', 20, 45, 'Female', 'Global', 'yoga,fitness,wellness', 0.09, 4.2, 90, 0.7, 70000, 1417.5, 'https://picsum.photos/500/400'),
('prod_008', 'Wireless Earbuds Pro', 'Electronics', 'Amazon', 14.0, 99.99, 2200, 0.030, 'High', 18, 40, 'All', 'Global', 'audio,technology,music', 0.11, 4.5, 83, 1.3, 60000, 726.0, 'https://picsum.photos/500/400'),
('prod_009', 'Home Office Desk Organizer', 'Office', 'Shopee', 28.0, 29.99, 3800, 0.050, 'Low', 25, 50, 'All', 'Global', 'office,organization,productivity', 0.06, 4.4, 75, 0.5, 40000, 1140.0, 'https://picsum.photos/500/400'),
('prod_010', 'Pet Camera with Treats', 'Pets', 'Amazon', 20.0, 149.99, 1500, 0.025, 'Medium', 25, 55, 'All', 'Global', 'pets,technology,home', 0.08, 4.6, 82, 1.8, 30000, 562.5, 'https://picsum.photos/500/400'),
('prod_011', 'Sustainable Water Bottle', 'Lifestyle', 'TikTok Shop', 35.0, 24.99, 5000, 0.055, 'Medium', 18, 40, 'All', 'Global', 'sustainability,fitness,lifestyle', 0.05, 4.3, 94, 0.4, 100000, 2062.5, 'https://picsum.photos/500/400'),
('prod_012', 'Blue Light Blocking Glasses', 'Health', 'Shopee', 26.0, 39.99, 3300, 0.040, 'Medium', 20, 45, 'All', 'Global', 'health,technology,eyecare', 0.10, 4.2, 86, 0.6, 65000, 1029.6, 'https://picsum.photos/500/400'),
('prod_013', 'Smart Plant Watering System', 'Home & Garden', 'Amazon', 18.0, 69.99, 1900, 0.033, 'Low', 25, 55, 'All', 'Global', 'gardening,smart-home,plants', 0.07, 4.5, 79, 1.1, 38000, 712.8, 'https://picsum.photos/500/400'),
('prod_014', 'Aromatherapy Diffuser', 'Wellness', 'TikTok Shop', 32.0, 44.99, 4200, 0.047, 'Medium', 22, 50, 'Female', 'Global', 'wellness,home,aromatherapy', 0.08, 4.4, 89, 0.7, 80000, 1881.6, 'https://picsum.photos/500/400'),
('prod_015', 'Travel Backpack Tech', 'Travel', 'Amazon', 16.0, 119.99, 1700, 0.027, 'Medium', 20, 40, 'All', 'Global', 'travel,technology,bags', 0.09, 4.6, 81, 1.4, 42000, 653.4, 'https://picsum.photos/500/400');

-- Sample campaigns for demo user
INSERT INTO campaigns (id, user_id, product_id, name, promotion_platform, budget, content_type, start_date, end_date, status, created_at)
VALUES
('camp_001', 'user_002', 'prod_001', 'TikTok Fitness Challenge', 'TikTok', 500.0, 'Short Video', strftime('%s', 'now', '-30 days'), NULL, 'active', strftime('%s', 'now', '-30 days')),
('camp_002', 'user_002', 'prod_004', 'Healthy Living Campaign', 'Instagram', 300.0, 'Reels', strftime('%s', 'now', '-20 days'), NULL, 'active', strftime('%s', 'now', '-20 days')),
('camp_003', 'user_002', 'prod_011', 'Eco-Friendly Lifestyle', 'TikTok', 400.0, 'Short Video', strftime('%s', 'now', '-15 days'), NULL, 'active', strftime('%s', 'now', '-15 days')),
('camp_004', 'user_002', 'prod_006', 'Content Creator Essentials', 'YouTube', 600.0, 'Long Video', strftime('%s', 'now', '-45 days'), strftime('%s', 'now', '-5 days'), 'completed', strftime('%s', 'now', '-45 days')),
('camp_005', 'user_002', 'prod_007', 'Yoga & Wellness Journey', 'Instagram', 250.0, 'Posts', strftime('%s', 'now', '-10 days'), NULL, 'active', strftime('%s', 'now', '-10 days'));

-- Sample sales data for campaigns
INSERT INTO sales (id, campaign_id, date, clicks, conversions, revenue, commission_earned, cost, created_at)
VALUES
-- Campaign 1 (30 days of data)
('sale_001', 'camp_001', strftime('%s', 'now', '-30 days'), 1200, 42, 3359.58, 503.94, 50.0, strftime('%s', 'now', '-30 days')),
('sale_002', 'camp_001', strftime('%s', 'now', '-25 days'), 1500, 53, 4239.47, 635.92, 50.0, strftime('%s', 'now', '-25 days')),
('sale_003', 'camp_001', strftime('%s', 'now', '-20 days'), 1800, 63, 5039.37, 755.91, 50.0, strftime('%s', 'now', '-20 days')),
('sale_004', 'camp_001', strftime('%s', 'now', '-15 days'), 2100, 74, 5919.26, 887.89, 50.0, strftime('%s', 'now', '-15 days')),
('sale_005', 'camp_001', strftime('%s', 'now', '-10 days'), 2400, 84, 6719.16, 1007.87, 50.0, strftime('%s', 'now', '-10 days')),
('sale_006', 'camp_001', strftime('%s', 'now', '-5 days'), 2700, 95, 7599.05, 1139.86, 50.0, strftime('%s', 'now', '-5 days')),

-- Campaign 2 (20 days of data)
('sale_007', 'camp_002', strftime('%s', 'now', '-20 days'), 800, 38, 1329.62, 332.41, 30.0, strftime('%s', 'now', '-20 days')),
('sale_008', 'camp_002', strftime('%s', 'now', '-15 days'), 950, 46, 1609.54, 402.39, 30.0, strftime('%s', 'now', '-15 days')),
('sale_009', 'camp_002', strftime('%s', 'now', '-10 days'), 1100, 53, 1854.47, 463.62, 30.0, strftime('%s', 'now', '-10 days')),
('sale_010', 'camp_002', strftime('%s', 'now', '-5 days'), 1250, 60, 2099.40, 524.85, 30.0, strftime('%s', 'now', '-5 days')),

-- Campaign 3 (15 days of data)
('sale_011', 'camp_003', strftime('%s', 'now', '-15 days'), 1500, 83, 2074.17, 726.0, 40.0, strftime('%s', 'now', '-15 days')),
('sale_012', 'camp_003', strftime('%s', 'now', '-10 days'), 1800, 99, 2474.01, 865.9, 40.0, strftime('%s', 'now', '-10 days')),
('sale_013', 'camp_003', strftime('%s', 'now', '-5 days'), 2100, 116, 2898.84, 1014.6, 40.0, strftime('%s', 'now', '-5 days')),

-- Campaign 4 (completed - 40 days of data)
('sale_014', 'camp_004', strftime('%s', 'now', '-45 days'), 2000, 76, 4559.24, 1003.0, 60.0, strftime('%s', 'now', '-45 days')),
('sale_015', 'camp_004', strftime('%s', 'now', '-35 days'), 2500, 95, 5699.05, 1253.8, 60.0, strftime('%s', 'now', '-35 days')),
('sale_016', 'camp_004', strftime('%s', 'now', '-25 days'), 2800, 106, 6358.94, 1399.0, 60.0, strftime('%s', 'now', '-25 days')),
('sale_017', 'camp_004', strftime('%s', 'now', '-15 days'), 3100, 118, 7078.82, 1557.3, 60.0, strftime('%s', 'now', '-15 days')),

-- Campaign 5 (10 days of data)
('sale_018', 'camp_005', strftime('%s', 'now', '-10 days'), 900, 41, 1885.59, 565.68, 25.0, strftime('%s', 'now', '-10 days')),
('sale_019', 'camp_005', strftime('%s', 'now', '-5 days'), 1100, 50, 2299.50, 689.85, 25.0, strftime('%s', 'now', '-5 days'));

-- Sample goals for demo user
INSERT INTO goals (id, user_id, monthly_income_goal, current_month, created_at)
VALUES
('goal_001', 'user_002', 5000.0, strftime('%m', 'now'), strftime('%s', 'now', '-30 days'));
