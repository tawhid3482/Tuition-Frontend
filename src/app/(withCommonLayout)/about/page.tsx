"use client";
import { useGetAllUserQuery } from "@/src/redux/features/user/userApi";
import React from "react";

const AboutPage = () => {
  const { data: users } = useGetAllUserQuery(undefined);
  console.log(users);
  return <div>all users</div>;
};

export default AboutPage;
