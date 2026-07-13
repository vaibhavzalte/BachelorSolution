import { api } from "../api/axios";
import { Room } from "@/types/listing.types";

export const RoomApi = {

    getAll(params?: object) {

        return api.get<Room[]>("/roomManagment/Room", {
            params,
        });

    },

    get(id: number) {

        return api.get<Room>(
            `/roomManagment/Room/${id}`
        );

    },

    create(data: FormData) {

        return api.post(
            "/roomManagment/Room",
            data,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data",
                },
            }
        );

    },

    delete(id: number) {

        return api.delete(
            `/roomManagment/Room/${id}`
        );

    },
};