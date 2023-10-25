"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: "accounting-3d0e8.firebaseapp.com",
  projectId: "accounting-3d0e8",
  storageBucket: "accounting-3d0e8.appspot.com",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AccountingPage = () => {
  const [recordType, setRecordType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [records, setRecords] = useState<record[]>([]);
  type record = {
    type: string;
    amount: number;
    description: string;
    id: string;
  };

  const handleAddRecord = async () => {
    if (amount && description) {
      // 創建新的記錄對象
      const newRecord = {
        type: recordType,
        amount: parseFloat(amount),
        description,
      };

      try {
        const docRef = await addDoc(collection(db, "records"), newRecord);
        console.log("Document written with : ", docRef.id);
        setRecords([...records, { id: docRef.id, ...newRecord } as record]);
      } catch (error) {
        console.error("Error adding document: ", error);
      }

      setAmount("");
      setDescription("");
    }
  };
  const totalIncome = records.reduce((total, record) => {
    return record.type === "income" ? total + record.amount : total;
  }, 0);

  const totalExpense = records.reduce((total, record) => {
    return record.type === "expense" ? total + record.amount : total;
  }, 0);

  const balance = totalIncome - totalExpense;

  const handleDeleteRecord = async (recordId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, "records", recordId));
      console.log("Document successfully deleted");
      setRecords(records.filter((record) => record.id !== recordId));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center mt-8">
        <select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          className="border border-gray-500 rounded px-2 py-1 mr-2 max-sm:2/12"
        >
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border border-gray-500 rounded px-2 py-1 mr-2 w-24 sm:w-32 md:w-48"
          placeholder="輸入金額"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-500 rounded px-2 py-1 mr-2 w-24 sm:w-32 md:w-48"
          placeholder="消費描述"
        />
        <Button
          variant="outline"
          onClick={handleAddRecord}
          className="max-sm:w-1/6"
        >
          新增紀錄
        </Button>
      </div>

      <div className="border-b border-gray-300 mt-9 mb-5"></div>
      <div className="w-1/3 mx-auto mt-8 max-sm:w-1/2">
        <ul>
          {records.map((record) => (
            <li
              key={record.id}
              className="flex items-center justify-between mb-2"
            >
              <span className="flex items-center max-sm:w-1/2">
                {record.type === "income" ? (
                  <span className="text-green-500 max-sm:w-1/2">
                    +&nbsp; {record.amount}{" "}
                  </span>
                ) : (
                  <span className="text-red-500 max-sm:w-1/2">
                    -&nbsp; {record.amount}
                  </span>
                )}
                <span className="spacer">&nbsp;&nbsp; </span>
                {record.description}
              </span>
              <Button
                variant="outline"
                className="ml-10"
                onClick={() => handleDeleteRecord(record.id)}
              >
                刪除
              </Button>
            </li>
          ))}
        </ul>

        <p className="flex flex-col items-center justify-center mt-8">
          小計: ${balance}
        </p>
        <Link
          href="/"
          className="flex flex-col justify-center items-center mt-8"
        >
          <Button variant="outline">回到首頁</Button>
        </Link>
      </div>
    </div>
  );
};

export default AccountingPage;
