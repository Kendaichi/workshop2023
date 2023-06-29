import Web3 from "web3";
import { useState, useEffect } from "react";
import Attendance from "./contract/Attendance.json";

function App() {
  const [contract, setContract] = useState(null);
  const [idnumber, setIdnumber] = useState("");
  const [list, setList] = useState([]);

  useEffect(() => {
    const init = async () => {
      //Check if Web3 is injected by metamask
      if (window.ethereum) {
        try {
          //request account access if needed
          await window.ethereum.request({ method: "eth_requestAccounts" });

          //get web3 instance
          const web3 = new Web3(window.ethereum);
          // console.log(web3);

          // for interaction we need the ABI and the Address

          //get the contract instance
          const networkId = await web3.eth.net.getId();
          const deployedContract = Attendance.networks[networkId]; // get the address
          // console.log(deployedContract);
          // console.log(deployedContract.address);

          if (!deployedContract) {
            console.error(`Contract not deployed on network ${networkId}`);
            return;
          }

          const contractABI = Attendance.abi;
          // console.log(contractABI);
          const myContract = new web3.eth.Contract(
            contractABI,
            deployedContract.address
          );

          // console.log(myContract);

          setContract(myContract);
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("Please install Metamask to use this Dapp");
      }
    };
    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();
      const dateUnixTimestamp = Math.floor(currentDate.getTime() / 1000);
      await contract.methods
        .addAttendance(idnumber, dateUnixTimestamp)
        .send({ from: "0x2433932827bF3b9695aBdFa0351c1507E3bFd517" });
      setIdnumber("");
      await getData();
    } catch (error) {
      console.log(error);
    }
  };

  const getData = async () => {
    console.log("Contract instance in getData:", contract);

    if (contract) {
      try {
        const getList = await contract.methods.getAllAttendance().call();
        const reversedList = [...getList].reverse();
        setList(reversedList);
        // console.log(getList);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [contract]);

  return (
    <div className="bg-slate-200 h-screen p-5">
      <div className="h-full flex justify-center gap-3 p-2">
        <div className=" w-full flex justify-center p-2">
          <div className="h-1/5 w-1/2 place-self-center flex flex-col p-1">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                required
                value={idnumber}
                onChange={(e) => setIdnumber(e.target.value)}
                className="border-2 border-black place-self-center mt-3 w-full"
              />

              <button
                type="submit"
                className="border-2 border-black w-1/5 mt-2 ml-[40%]"
              >
                Save
              </button>
            </form>
          </div>
        </div>
        <div className="border-2 border-black w-full p-5 flex flex-col gap-3 overflow-y-scroll">
          {list.map((item, index) => (
            <div key={index} className="border border-gray-300 p-3">
              <p>Date: {new Date(Number(item[1]) * 1000).toLocaleString()}</p>
              <p>ID Number: {item[2]}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
