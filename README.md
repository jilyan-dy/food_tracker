# Food Tracker

This project was created to help track a household's food inventory to prevent over buying and spoiling of foods.
The project was created using Flask, ReactJS, and MySQL.

<!-- # To Run
-> export NODE_OPTIONS=--openssl-legacy-provider
-> in flask-server run "python app.py"
-> in client run "npm start"

# For DB
service mysql stop
service mysql start
or
sudo /etc/init.d/mysql start <!--if my sql start is causing error--
mysql -u root -p
enter pw use top numbers

# migration
flask db migrate -m 'message'
flask db upgrade -->

## Views

When you first run this app you'll be brought to the homepage where you could either login or register.

### Homepage

![Homepage](https://github.com/jilyan-dy/food_tracker/blob/master/figs/homepage.png?raw=true)

### Register

![Register](https://github.com/jilyan-dy/food_tracker/blob/master/figs/register.PNG?raw=true)

### Login

![Login](https://github.com/jilyan-dy/food_tracker/blob/master/figs/login.PNG?raw=true)

### View Items

![View Items](https://github.com/jilyan-dy/food_tracker/blob/master/figs/view_items.PNG?raw=true)

### Add Item

![Add Item](https://github.com/jilyan-dy/food_tracker/blob/master/figs/add_item.PNG?raw=true)

### Edit Item

![Edit Item](https://github.com/jilyan-dy/food_tracker/blob/master/figs/edit_item.PNG?raw=true)

### Delete Item

![Delete Item](https://github.com/jilyan-dy/food_tracker/blob/master/figs/delete_item.png?raw=true)

### Profile

![Profile](https://github.com/jilyan-dy/food_tracker/blob/master/figs/profile.PNG?raw=true)
