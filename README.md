<link href="readme.css" rel="stylesheet"></link>

# Food Tracker

This project was created for tracking personal and shared food inventory.
It informs the user when their items are past their expiration date by highlighting them in red.
Each user can view and modify their inventory and see shared items. Users can join or create a household where members can share items.
With this app, users can quickly identify what items they own and prevent overstocking or wasting food.

The project was implemented using Flask, React, and MySQL.

<h3>Usage</h3>
Starting Database

```
service mysql start
```

or

```
sudo /etc/init.d/mysql start
```

Run server

```
cd flask-server
python app.py
```

Run Client on a separate terminal

```
cd client
export NODE_OPTIONS=--openssl-legacy-provider
npm start
```

<h3>Views</h3>

When you first run this app you'll be brought to the homepage where you could either login or register.

<h5>Register</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/signup.PNG?raw=true)

<h5>Login</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/login.PNG?raw=true)

<h5>View Items</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/view_items.PNG?raw=true)

<h5>Add Item</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/add_item.PNG?raw=true)

<h5>Edit Item</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/edit_item.PNG?raw=true)

<h5>Profile</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/profile.PNG?raw=true)

<h5>House</h5>

![preview](https://github.com/jilyan-dy/food_tracker/blob/master/figs/house.PNG?raw=true)

<h3>Implementation Notes</h3>

- If package dependencies are causing errors run:

```
npm install --legacy-peer-deps
```

- To apply updates to database structure

```
flask db migrate -m 'message'
flask db upgrade
```

<!--
# if package dependencies causing error
npm install --legacy-peer-deps

# To Run
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
