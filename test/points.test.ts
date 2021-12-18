import { sign } from "jsonwebtoken";
import request from "supertest";
import { app } from "../src/server";

describe("Events API", () => {
    let eventId: string;
    let userId: String;

    it("POST /events -> Should Create a New Event [Authorized]", (done) => {
        request(app)
            .post("/events")
            .set(
                "Authorization",
                `Bearer ${sign({ role: "EXEC" }, process.env.JWT_SECRET)}`
            )
            .send({
                name: "Test-Event",
                pointValue: 100,
            })
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: expect.any(String),
                        type: expect.any(String),
                        name: expect.any(String),
                        value: expect.any(Number),
                        enabled: expect.any(Boolean),
                        linkCode: expect.anything,
                        createdAt: expect.any(Date),
                        updatedAt: expect.any(Date),
                    })
                );

                eventId = response.body.id;
            })
            .catch((err) => done(err));
    });

    it("POST /events -> Should Return Unauthorized [Unauthorized]", (done) => {
        request(app)
            .post("/events")
            .send({
                name: "Test-Event",
                pointValue: 100,
            })
            .expect("Content-Type", /json/)
            .expect(401)
            .catch((err) => done(err));
    });

    it("GET /events -> Should Return Unauthorized [Unauthorized]", (done) => {
        request(app)
            .get("/events")
            .expect("Content-Type", /json/)
            .expect(401)
            .catch((err) => done(err));
    });

    it("GET /events -> Should Return All Events [Authorized]", (done) => {
        request(app)
            .get("/events")
            .set(
                "Authorization",
                `Bearer ${sign({ role: "EXEC" }, process.env.JWT_SECRET)}`
            )
            .expect("Content-Type", /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            type: expect.any(String),
                            name: expect.any(String),
                            value: expect.any(Number),
                            enabled: expect.any(Boolean),
                            linkCode: expect.anything,
                            createdAt: expect.any(Date),
                            updatedAt: expect.any(Date),
                        }),
                    ])
                );
            })
            .catch((err) => done(err));
    });

    // it("GET /events/users/{id} -> Should Return All Attendees of an Event [Authorized]", (done) => {
    //     request(app)
    //         .get(`/events/users/id`)
    //         .expect("Content-Type", /json/)
    //         .expect(200)
    //         .then((response) => {
    //             expect(response.body).toEqual(
    //                 expect.arrayContaining([
    //                     expect.objectContaining({
    //                         id: expect.any(String),
    //                         name: expect.any(String),
    //                         osis: expect.anything,
    //                         email: expect.any(String),
    //                         emailVerified: expect.any(Date),
    //                         image: expect.anything,
    //                         role: expect.any(String),
    //                         points: expect.any(Number),
    //                     }),
    //                 ])
    //             );
    //         })
    //         .catch((err) => done(err));
    // });

    // it("Get /events/users/{id} -> Should Return 404 (Invalid User ID)", (done) => {
    //     request(app)
    //         .get("/events")
    //         .expect("Content-Type", /json/)
    //         .expect(404)
    //         .catch((err) => done(err));
    // });
});
