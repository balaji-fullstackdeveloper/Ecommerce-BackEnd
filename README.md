# Ecommerce

an E-commerce Website built with MERN stack.
## FrontEnd Source Code

https://github.com/balaji-fullstackdeveloper/Ecommerce-FrontEnd

## Front End Deploy URL

https://66f154213e2f92e1e894908a--thunderous-croissant-c12998.netlify.app/


##Instruction

after cloning, run this command in the root folder
```bash
npm install
```
navigate to "frontend" folder, run these commands 
```bash
npm install
npm run build
```
wait for application build
after that open the backend/config/config.env
and update the MongoDB connection string
```bash
...
DB_LOCAL_URI=mongodb://localhost:27017/ecommerce
```

navigate back to "root" folder and run this command for loading demo data
```bash
npm run seeder
```

run this below command to run the app in production mode
```bash
npm run prod
```


## Test
open the http://localhost:8000 and test the 



