import { useEffect, useState } from "react";
import { Appbar } from "../components/Appbar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";
import axios from "axios";

export const Dashboard = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function getBalance() {
      const response = await axios.get(
        "http://localhost:3000/api/v1/account/balance"
      );
      setBalance(response.data.balance);
    }
    getBalance();
  }, []);

  return (
    <div>
      <Appbar />
      <div className="px-8">
        <Balance value={balance} />
        <Users />
      </div>
    </div>
  );
};
