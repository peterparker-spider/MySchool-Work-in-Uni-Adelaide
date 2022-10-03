# To Makers
Our project's frontend and backend is in seperated package.  
To start backend server: `npm start`  
To start frontend interface: `cd social_planning_app && npm run server`

To Configure `MySQL` connection strings, go to: `util/conn.js`  
To Configure `SMTP` settings0, go to: `util/mailer.js`  

An initial `SQL` script is in the root folder with a name `event-plan.sql`

PROOF of Email notification:  
![[ email-proof.png ]]

**IMPORTANT:** Both server need to be up for testing  

File Structure
---
`routes` -- Contains server routes and API
`util/mailer.js` -- SMTP Server Configurations  
`util/conn.js` -- Connection to the `MySQL` database   
`social_planning_app/vue.config.js` -- configure the ports that clients runs on. (Default: **8080**)

`social_planning_app` -- main folder containing all client resources  
`social_planning_app/public` -- fallback for non-js script environment  
`social_planning_app/src` -- main client source code.  
`social_planning_app/src/api` -- Client API
`social_planning_app/src/assets` -- CSS & IMGS
`social_planning_app/src/router` -- Client Router
`social_planning_app/src/component` -- Client Global Mapper (Headers/index)
`social_planning_app/src/views` -- The GUI Component of the website








---
# Features Implemented
User Register  
User Login  

Management Tab  
Email Notification  
Calendar View
Invite people to join via email  

Create/Modification of an Event














# Brief Design


Function: forgot password
location.href("xxx"+username)
Data collected: database schema, data plan, interface
Forth normal form.
    Login: email and password \
    Register: email, username, password\
    Possible other data to collect: age, gender,
    

    inforamtion management

    user_id:    
    username:
    age:
    gender:
    contact_number:
    email_address:
----------------------------------------------------------

    Link-generator

    link_id:
    link_url:
    link_password:
------------------------------------------------------------

    Event

    event_id:
    event_name: 
    event_desc: 
    event_start_time: 
    event_end_time: 
    event_cofirm_status defaut false,
    finalized_event_time:

--------------------------------------------------------------

    Adding event into Calendar system

    adding id:
    adding_username:
    adding_date: 
    adding time:
    cancel_id:
    successful_adding_id
    fail_adding_id:

-----------------------------------------------------------

    Admin management

    manager_id:
    mananger_username:
    manager_email:
    manager_contact_number:
    manage_user_id:
    manage_event_id:
    sign-up_other_admin_id:

-------------------------------------------------------------------







## Code Usage
First time install: `make install`  
To lint code: `./eslint`  
To automatic push: `make push`
#### Non VS-Code IDE Only (strongly not recommend):
To noob start & stop server
`make start` & `make stop`