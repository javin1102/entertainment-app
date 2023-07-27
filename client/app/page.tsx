"use client";
import { useSelector } from "react-redux";
import type { StoreState } from "./store/store";
import { useAuthenticate } from "./hooks/use-authenticate";
const Home: React.FC = () => {
	const user = useSelector((state: StoreState) => state.user);
	const { isAuthenticated } = useAuthenticate(user?.access_token);

	return <>{isAuthenticated && <div className="body-sm-text">Home</div>}</>;
};

export default Home;
