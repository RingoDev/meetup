import { useDispatch } from "react-redux";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";

const useActionDispatch = <P, T extends string>(
  actionCreator: ActionCreatorWithPayload<P, T>,
) => {
  const dispatch = useDispatch();
  return (payload: P) => dispatch(actionCreator(payload));
};

export default useActionDispatch;
