import { rest } from "msw";

const baseURL = "https://bunnyland-drf.herokuapp.com"

export const handlers = [
    rest.get(`${baseURL}/dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            ctx.json(
                {
                    "pk": 1,
                    "username": "Karin",
                    "email": "",
                    "first_name": "",
                    "last_name": "",
                    "profile_id": 1,
                    "profile_image": "https://res.cloudinary.com/dglcwfgzw/image/upload/v1/media/images/bunny-4770851_640_kgvw9a"
                })
        );
    }),
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
        return res(ctx.status(200))
    }),
];