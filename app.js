const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const request = require("request");

const app = express();


// 813d1c608fdab4e2eb79984573d3a80a-us14 -api key
// 44939bf66e - unique id

app.use(bodyParser.urlencoded({extended:true}));

app.use('*/css', express.static('public/css'));
app.use('*/images', express.static('public/images'));


app.get("/", function(req, res){

    res.sendFile(__dirname + "/signup.html", function(){

        console.log("The app is running");
    })
})


app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    console.log(firstName, lastName, email)

    let data ={

        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/44939bf66e";
    const options = {

        method: "POST",
        auth: "umang:813d1c608fdab4e2eb79984573d3a80a-us14"
    }


   const request = https.request(url, options, function(response){

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
        if(response.statusCode === 200){

            res.sendFile(__dirname + "/success.html")
        }

        else {
            res.sendFile(__dirname + "/failure.html")

        }
        

    });

    request.write(jsonData);
    request.end();


})



app.post("/failure", function(req, res){

    res.redirect("/")

})



app.listen(process.env.PORT || 3000, function(){

    console.log("The app is running on port 3000");
})

