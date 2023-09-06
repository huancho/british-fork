import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "../../redux/slice";
import SideMenu from "./SideMenu";
import MainContent from "./MainContent";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";

const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchData());
  }, [dispatch]);

  let { data } = useSelector((state) => state.reducer);

  let headers = [
    "Name",
    "Lastname",
    "Email",
    "Club Name",
    "Phone Number",
    "Gender",
    "Effective Date",
    "Role",
    "Status",
    "Amilia",
    "Last Update",
  ];

  data = data.map((row) => {
    const item9 = row[11];
    const before = row.slice(0, 3);
    const after = row.slice(3, 10);
    return [...before, item9, ...after];
  });

  let { isBcsf } = useSelector((state) => state.reducer);
  isBcsf = true;

  const rolePosition = isBcsf ? 7 : 6;
  const statusPosition = isBcsf ? 8 : 7;
  const amiliaPosition = isBcsf ? 9 : 8;

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState(data || []);
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedClub, setSelectedClub] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedAmilia, setSelectedAmilia] = useState("All");

  const uniqueRoleValues = [
    // eslint-disable-next-line
    ...new Set(data.map((item) => item[rolePosition])),
  ].filter((el) => el !== "");

  const uniqueClubValues = [
    // eslint-disable-next-line
    ...new Set(data.map((item) => item[3])),
  ].filter((el) => el !== "");

  const uniqueStatusValues = [
    // eslint-disable-next-line
    ...new Set(data.map((item) => item[statusPosition])),
  ].filter((el) => el !== "");

  const uniqueAmiliaValues = [
    // eslint-disable-next-line
    ...new Set(data.map((item) => item[amiliaPosition])),
  ].filter((el) => el !== "");

  const handleRoleChange = (newSelectedRole) => {
    setSelectedRole(newSelectedRole);
  };

  const handleClubChange = (newSelectedClub) => {
    setSelectedClub(newSelectedClub);
  };

  const handleStatusChange = (newSelectedStatus) => {
    setSelectedStatus(newSelectedStatus);
  };

  const handleAmiliaChange = (newSelectedAmilia) => {
    setSelectedAmilia(newSelectedAmilia);
  };

//   useEffect(() => {
//     if (data && data.length > 0 && filteredData.length === 0) {
//       setFilteredData(data);
//     }
//   }, [data, filteredData]);

  useEffect(() => {
    let newFilteredData = [...data];

    if (searchQuery) {
      newFilteredData = newFilteredData.filter((row) =>
        row.some(
          (cell) =>
            typeof cell === "string" &&
            cell.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    if (selectedRole && selectedRole !== "All") {
      newFilteredData = newFilteredData.filter(
        (row) => row[rolePosition] === selectedRole
      );
    }

    if (selectedClub && selectedClub !== "All") {
      newFilteredData = newFilteredData.filter(
        (row) => row[3] === selectedClub
      );
    }

    if (selectedStatus && selectedStatus !== "All") {
      newFilteredData = newFilteredData.filter(
        (row) => row[statusPosition] === selectedStatus
      );
    }

    if (selectedAmilia && selectedAmilia !== "All") {
      newFilteredData = newFilteredData.filter(
        (row) => row[amiliaPosition] === selectedAmilia
      );
    }

    setFilteredData(newFilteredData);
  }, [
    data,
    searchQuery,
    selectedRole,
    selectedClub,
    selectedStatus,
    selectedAmilia,
    rolePosition,
    statusPosition,
    amiliaPosition
  ]);

  if (!data || data.length < 1) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Side Menu */}
      <SideMenu />
      <div className="lg:pl-[280px]">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <div id="historicalDiv">
                {/* Main Content */}
                <MainContent
                  originalData={data}
                  handleRoleChange={handleRoleChange}
                  rolePosition={rolePosition}
                  selectedRole={selectedRole}
                  handleClubChange={handleClubChange}
                  selectedClub={selectedClub}
                  handleStatusChange={handleStatusChange}
                  statusPosition={statusPosition}
                  selectedStatus={selectedStatus}
                  handleAmiliaChange={handleAmiliaChange}
                  amiliaPosition={amiliaPosition}
                  selectedAmilia={selectedAmilia}
                  uniqueRoleValues={uniqueRoleValues}
                  uniqueClubValues={uniqueClubValues}
                  uniqueStatusValues={uniqueStatusValues}
                  uniqueAmiliaValues={uniqueAmiliaValues}
                />
                {/* SearchBar */}
                <SearchBar setSearchQuery={setSearchQuery} />

                <div className="mt-1 flow-root">
                  <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg max-w-screen">
                        <DataTable data={filteredData} headers={headers} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
