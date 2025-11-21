import React, { useEffect, useState } from "react";
import api from "axios";
import { Blocks, Hash } from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import Card from "../components/Card";
import Table from "../components/Table";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

const BlockchainExplorer = () => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState(null);

  const navigate = useNavigate(); // ⭐ added

  useEffect(() => {
    fetchBlockchainInfo();
  }, []);

  const fetchBlockchainInfo = async () => {
    setLoading(true);
    try {
      const res = await api.get("http://localhost:3000/getBlockchainInfo");

      if (res.data.success) {
        setInfo(res.data.blockchain);
      }
    } catch (error) {
      console.error("Failed to load blockchain info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role="admin" userName="Admin">

      {/* ⭐ BACK BUTTON */}
      <div className="mb-4">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          ← Back
        </Button>
      </div>

      <Card title="Hyperledger Fabric Blockchain Info" icon={Blocks}>
        {loading || !info ? (
          <p className="text-center text-gray-500 py-6">Loading blockchain data...</p>
        ) : (
          <div className="space-y-4">

            {/* BASIC BLOCKCHAIN STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-white shadow">
                <h2 className="text-sm text-gray-600">Ledger Height</h2>
                <p className="text-xl font-semibold">{info.height}</p>
              </div>

              <div className="p-4 border rounded-lg bg-white shadow">
                <h2 className="text-sm text-gray-600">Latest Block Number</h2>
                <p className="text-xl font-semibold">{info.latestBlockNumber}</p>
              </div>

              <div className="p-4 border rounded-lg bg-white shadow">
                <h2 className="text-sm text-gray-600">Transactions in Latest Block</h2>
                <p className="text-xl font-semibold">
                  {info.latestBlock.data.data.length}
                </p>
              </div>
            </div>

            {/* HASHES */}
            <Card title="Block Hashes" icon={Hash}>
              <Table
                headers={["Field", "Value"]}
                data={[
                  {
                    field: "Current Block Hash",
                    value: info.currentBlockHash.substring(0, 50) + "...",
                  },
                  {
                    field: "Previous Block Hash",
                    value: info.previousBlockHash.substring(0, 50) + "...",
                  },
                ]}
                renderRow={(row) => (
                  <tr>
                    <td className="px-6 py-4 text-gray-700 font-medium">{row.field}</td>
                    <td className="px-6 py-4 font-mono text-sm">{row.value}</td>
                  </tr>
                )}
              />
            </Card>

            {/* RAW BLOCK */}
            <Card title="Latest Block (Raw Data)" icon={Blocks}>
              <pre className="bg-black text-green-400 text-xs p-4 rounded-lg overflow-auto max-h-96">
                {JSON.stringify(info.latestBlock, null, 2)}
              </pre>
            </Card>
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
};

export default BlockchainExplorer;
