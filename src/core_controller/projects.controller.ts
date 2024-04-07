// import to from "await-to-js";
import fs from 'fs'
import { Request, Response } from "express";
import * as Json from "../../dummy/epics.json";


export class Projects {
    static async FetchProjects(req: Request, res: Response) {
        let fetchPayload = new Projects();
        return fetchPayload.fetchAndCreateProjects(req, res);
    }

    async fetchAndCreateProjects(request: Request, response: Response) {
        const value = Json;
        this.createProjects(value)
    }

    async createProjects(epicsObjects: Object[]) {
        epicsObjects.map((epic)=> {
            console.log("🚀 ~ Projects ~ epicsObjects.map ~ epic:", epic);
        });
    }
}