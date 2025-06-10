"use client"

import axios from "axios";
import Router from "next/router";


export const login = async (email: string, password: string) => {
    try {
        const response = await axios.post(
            "https://shortix.onrender.com/auth/login",
            { email, password },
            { withCredentials: true }
        );

        if (response.status === 200) {
            Router.push("/dashboard")
        } else {
            window.location.href = "/";
        }
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;

            if (status === 404) {
                alert("User not found. Please register first.");
            } else if (status === 401) {
                alert("Invalid password. Please try again.");
            } else if (status === 400) {
                alert("Email and password are required.");
            } else {
                alert("An unexpected error occurred.");
            }
        } else {
            alert("Network or unknown error." +error);
        }
    }
};
