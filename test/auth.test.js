const chai = require("chai");
const chaiHttp = require("chai-http");
const request = require('request');
require('dotenv').config();

const { expect } = chai;
chai.use(chaiHttp);
// describe("HomeScreen ", () => {
//     it("welcomes user to the api!", done => {
//         chai
//             .request('https://winner-yoga.herokuapp.com')
//             .get("/")
//             .end((err, res) => {
//                 expect(res).to.have.status(200);
//                 expect(res.body.message).to.equals("Welcome to Winner-Yoga webapp backend..");
//                 done();
//             });
//     });
// });

describe("Register ", () => {

    const email = 'tester@gmail.com';
    const password = 'tester@1234';
    let id;

    // it("should throw an error with code 409 if register user with already exist email!", done => {
    //     chai
    //         .request('https://winner-yoga.herokuapp.com')
    //         .post("/register")
    //         .send({
    //             email: "avin12.tcs@gmail.com",
    //             password: "pradip",
    //             name: "avin"
    //         })
    //         .end((err, res) => {
    //             expect(res).to.have.status(409);
    //             expect(res.body.status).to.equals(0);
    //             done();
    //         });
    // });

    // it("should throw an error with code 411 if register user with invalid password!", done => {
    //     chai
    //         .request('https://winner-yoga.herokuapp.com')
    //         .post("/register")
    //         .send({
    //             email: "avi@gmail.com",
    //             password: "pr",
    //             name: "avin"
    //         })
    //         .end((err, res) => {
    //             expect(res).to.have.status(411);
    //             expect(res.body.ErrorMessage).to.equals("Password is too weak");
    //             expect(res.body.status).to.equals(0);
    //             done();
    //         });
    // });

    // it("should throw an error with code 406 if register user with invalid email!", done => {
    //     const email = 'avin12gmail.com'
    //     chai
    //         .request('https://winner-yoga.herokuapp.com')
    //         .post("/register")
    //         .send({
    //             email: email,
    //             password: "avin12",
    //             name: "avin"
    //         })
    //         .end((err, res) => {
    //             expect(res).to.have.status(406);
    //             expect(res.body.ErrorMessage).to.equals(`error in email - email format validation failed: ${email}`);
    //             expect(res.body.status).to.equals(0);
    //             done();
    //         });
    // });

    it("should send a response with code 200 if register with valid email, password or name!", done => {
        chai
            .request('https://winner-yoga.herokuapp.com')
            .post("/register")
            .send({
                email: email,
                password: password,
                name: 'tester',
                is_test: 1
            })
            .end((err, res) => {
                id = res.body.data.id
                expect(res).to.have.status(200);
                expect(res.body.status).to.equals(1);
                done();
            });
    });

    // it("should throw an error with code 500 if internal server error!", done => {
    //     chai
    //         .request('https://winner-yoga.herokuapp.com')
    //         .post("/register")
    //         .send({
    //             password: "pradip",
    //             name: "avin"
    //         })
    //         .end((err, res) => {
    //             expect(res).to.have.status(500);
    //             expect(res.body.status).to.equals(0);
    //             done();
    //         });
    // });
});