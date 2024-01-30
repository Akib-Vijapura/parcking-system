"use client";
import React from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { increment, decrement } from "@/lib/features/counterSlice";

const page = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default page;
