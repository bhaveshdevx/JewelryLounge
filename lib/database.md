cart			
Field Name	Type	Description	Example
id	UUID	Primary Key	cart-111...
user_id	UUID	The shopper	user-aditi-uuid
product_id	UUID	The jewelry item	prod-1234...
quantity	Integer	For Cart only (Saved items don't need this)	1
save_type	Varchar	Only for saved_items table: ('liked' or 'wishlist')	wishlist'

profiles			
Field Name	Type	Description	Example
id	UUID	Primary Key (Linked to Auth)	550e8400-e29b...
role	Varchar	Access level (customer, admin, staff)	admin'
full_name	Varchar	User's complete name	Aditi Sharma'
phone_number	Varchar	Contact for login & delivery	+919876543210'
saved_addresses	JSONB	Array of their delivery locations	[{"type": "Home", "city": "Mumbai"}]
created_at	Timestamp	When they joined the app	2026-03-02 12:30:00


products			
Field Name	Type	Description	Example
id	UUID	Primary Key	prod-1234...
title	Varchar	Display name of the jewelry	Rose Gold Matte Hoops'
description	Text	Detailed info & care instructions	Hypoallergenic brass...'
cost_price	Numeric	Our buying/manufacturing cost	150
selling_price	Numeric	Retail price (Original MRP)	599
discount_price	Numeric	Active sale price (Null if no sale)	499
category_id	UUID	Link to the "Vibe" Bubbles table	cat-wedding-uuid
media_urls	Array (Text)	URLs for Feed video & images	['vid1.mp4', 'img1.jpg']
attributes	JSONB	Dynamic filters (Color, Material)	{"material": "AD", "color": "Rose"}
stock_count	Integer	Real-time inventory level	45
is_active	Boolean	Toggle to hide out-of-stock items	TRUE

orders			
Field Name	Type	Description	Example
id	UUID	Primary Key	ord-9876...
user_id	UUID	Link to the buyer's profile	user-aditi-uuid
total_amount	Numeric	Final amount paid by customer	499
payment_status	Varchar	Pending, Paid, Failed, Refunded	Paid'
order_status	Varchar	Processing, Shipped, Delivered	Processing'
shipping_details	JSONB	Frozen snapshot of the address	{"pincode": "400001", "state": "MH"}
created_at	Timestamp	Time of purchase	2026-03-02 14:00:00

order item			
Field Name	Type	Description	Example
id	UUID	Primary Key	item-567...
order_id	UUID	Link to the main order	ord-9876...
product_id	UUID	Link to the specific jewelry piece	prod-1234...
price_at_purchase	Numeric	The exact price they locked in	499
quantity	Integer	How many they bought	2

