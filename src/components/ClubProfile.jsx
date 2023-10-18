import { useState, useEffect } from "react";
import { fetchClubData } from "../../redux/slice";
import { useDispatch } from "react-redux";
import AddClubModal from "./AddClubModal";
import "./Arrow.css";
// eslint-disable-next-line
function ClubProfile({ isBcsf, clubData, uniqueClubValues }) {
  function formatDate(date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [month, day, year].join("/");
  }
  // eslint-disable-next-line
  const [selectedClub, setSelectedClub] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClubs, setFilteredClubs] = useState([]);
  const [menuVisible, setMenuVisible] = useState(false);
  const [clubMenuOpen, setClubMenuOpen] = useState("");
  const [clubToDelete, setClubToDelete] = useState("");
  const [postDeleteClub, setPostDeleteClub] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [openAddClubModal, setOpenAddClubModal] = useState(false);
  const [editingClub, setEditingClub] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [isLoadingEditClub, setIsLoadingEditClub] = useState(false);
  const [postingEditClub, setPostingEditClub] = useState(false);

  const handleEditClick = (clubName) => {
    setEditingClub(clubName);
    setMenuVisible(false);
  };

  const dispatch = useDispatch();

  const postEditClub = async (clubName, editedData) => {
    let url =
      "https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec"; // Your URL here
    const options = {
      method: "post",
      mode: "no-cors",
      body: JSON.stringify({
        action: "editClubData",
        changes: editedData,
        clubName: clubName,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    await fetch(url, options);
  };

  const deleteClub = async (clubName) => {
    let url = `https://script.google.com/macros/s/AKfycbzS8V3isIRn4Ccd1FlvxMXsNj_BFs_IQe5r7Vr5LWNVbX2v1mvCDCYWc8QDVssxRj8k3g/exec?action=deleteClub&clubName=${clubName}`;

    await fetch(url, {
      mode: "no-cors",
    });
  };

  useEffect(() => {
    // Apply search and select filters here
    let filtered = clubData;

    if (searchTerm) {
      filtered = filtered.filter((club) =>
        club[0].toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClub) {
      filtered = filtered.filter((club) => club[0] === selectedClub);
    }

    setFilteredClubs(filtered);

    if (postDeleteClub == true && !isLoadingPost) {
      const deletePost = async () => {
        setIsLoadingPost(true);
        await deleteClub(clubToDelete);
        dispatch(fetchClubData());
        setPostDeleteClub(false);
        setIsLoadingPost(false);
        setMenuVisible(false);
      };
      deletePost();
    }

    if (postingEditClub == true && !isLoadingEditClub) {
      const editingClubData = async () => {
        setIsLoadingEditClub(true);
        await postEditClub(editingClub, editedData);
        dispatch(fetchClubData());
        setEditingClub(null);
        setPostingEditClub(false);
        setIsLoadingEditClub(false);
        setMenuVisible(false);
        // postEditClub(false);
      };
      editingClubData();
    }
  }, [
    searchTerm,
    selectedClub,
    clubData,
    clubToDelete,
    postDeleteClub,
    isLoadingPost,
    editingClub,
    editedData,
    isLoadingEditClub,
    postingEditClub,
    dispatch,
  ]);

  const handleClubChange = (e) => {
    setSelectedClub(e.target.value);
  };

  const handleSaveChanges = () => {
    console.log("club", editingClub);
    console.log(editedData);
    setPostingEditClub(true);
  };

  const handleCancelEdit = () => {
    setEditingClub(null);
    setMenuVisible(false);
  };

  function handleInputChange(label, value) {
    setEditedData((prevData) => ({
      ...prevData,
      [label]: value,
    }));
    console.log(label, value);
  }

  const handleOpenMenu = (clubname) => {
    if (menuVisible == false) {
      setIsLoadingEditClub(false);
      setMenuVisible(true);
      setClubMenuOpen(clubname);
    } else {
      setMenuVisible(false);
    }
  };

  const handleDeleteClub = (clubname) => {
    setClubToDelete(clubname);
    setPostDeleteClub(true);
  };

  const handleOpenAddClubModal = () => {
    // if (openAddClubModal == false) {
    setOpenAddClubModal(true);
    // } else {
    //   setOpenAddClubModal(false)
    // }
  };

  return (
    <div>
      {isBcsf ? (
        <>
          <div className="flex justify-end">
            <button
              id="addClubBtn"
              type="button"
              onClick={handleOpenAddClubModal}
              className="w-[130px] right-0 rounded-full bg-[#243570] px-3 py-2 mb-4 text-base font-semibold text-white montserrat shadow-sm hover:bg-[#535787]"
            >
              Add Club
            </button>
          </div>
        </>
      ) : (
        <></>
      )}
      <div className="flex flex-col justify-center items-center">
        {isBcsf ? (
          <>
            <div>
              <div className="flex items-center mb-8 justify-center">
                <div className="relative bg-transparent border-slate-100 border rounded-full w-[250px] h-10 items-center flex justify-around">
                  <input
                    id="clubSearch"
                    className="pl-8 px-4 rounded-full bg-transparent appearance-none pr-8 focus:outline-none focus:border-none text-sm w-full"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-2 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#4F5664"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="bg-slate-100 rounded-full w-[250px] h-10 ml-2 items-center flex justify-around">
                  <div className="svg-container flex h-10 items-center ml-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="#4F5664"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.792 2.938A49.069 49.069 0 0112 2.25c2.797 0 5.54.236 8.209.688a1.857 1.857 0 011.541 1.836v1.044a3 3 0 01-.879 2.121l-6.182 6.182a1.5 1.5 0 00-.439 1.061v2.927a3 3 0 01-1.658 2.684l-1.757.878A.75.75 0 019.75 21v-5.818a1.5 1.5 0 00-.44-1.06L3.13 7.938a3 3 0 01-.879-2.121V4.774c0-.897.64-1.683 1.542-1.836z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <select
                    id="clubSelect"
                    className="px-2 rounded-full w-[210px] statusSelect bg-transparent appearance-none border-0 pr-8 focus:outline-none focus:ring-0 focus:border-none text-sm"
                    onChange={handleClubChange}
                  >
                    <option value="">All Clubs</option>
                    {/* eslint-disable-next-line */}
                    {uniqueClubValues.map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
        <div className="flex flex-wrap justify-center items-start">
          <div className="w-full p-4">
            {openAddClubModal ? (
              <AddClubModal setOpenAddClubModal={setOpenAddClubModal} />
            ) : (
              <></>
            )}
            <ul
              role="list"
              id="clubsProfileContainer"
              className={
                isBcsf
                  ? "grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 xl:gap-x-8 flex justify-center items-center"
                  : "flex justify-center items-center"
              }
            >
              {filteredClubs &&
                // eslint-disable-next-line
                filteredClubs.map((club, index) => {
                  return (
                    <li
                      key={index}
                      className="overflow-hidden montserrat rounded-xl border border-gray-200 w-[26rem]"
                    >
                      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                        <div className="text-base font-semibold leading-6 text-[#243746]">
                          {club[0]}
                        </div>
                        <div className="relative ml-auto">
                          {editingClub === club[0] ? (
                            isLoadingEditClub ? (
                              <div
                                className="flex justify-center items-center"
                                style={{ marginTop: "30px", height: "5px" }}
                              >
                                <div
                                  className="spinner border-t-2 border-solid rounded-full animate-spin"
                                  style={{
                                    borderColor: "#303030",
                                    borderRightColor: "transparent",
                                    width: "1rem",
                                    height: "1rem",
                                  }}
                                ></div>
                              </div>
                            ) : (
                              <>
                                <button
                                  className="font-semibold text-base text-[#535787] cursor-pointer bg-transparent"
                                  onClick={() => handleSaveChanges(club[0])}
                                >
                                  Save
                                  <span className="sr-only">, {club[0]}</span>
                                </button>
                                <button
                                  className="font-semibold text-base text-[#535787] cursor-pointer bg-transparent ml-6"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                  <span className="sr-only">, {club[0]}</span>
                                </button>
                              </>
                            )
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenMenu(club[0])}
                                className="menu-button -m-2.5 block p-2.5 text-gray-400 hover:text-gray-500"
                                id={`options-menu-${index}-button`}
                                aria-expanded="false"
                                aria-haspopup="true"
                              >
                                <span className="sr-only">Open options</span>
                                <svg
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  aria-hidden="true"
                                >
                                  <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                </svg>
                              </button>
                              {menuVisible && club[0] === clubMenuOpen && (
                                <div
                                  className="dropdown-menu absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none"
                                  role="menu"
                                  aria-orientation="vertical"
                                  aria-labelledby={`options-menu-${index}-button`}
                                  tabIndex="-1"
                                >
                                  {isLoadingPost || isLoadingEditClub ? (
                                    <div
                                      className="flex justify-center items-center"
                                      style={{
                                        marginTop: "30px",
                                        height: "5px",
                                      }}
                                    >
                                      <div
                                        className="spinner border-t-2 border-solid rounded-full animate-spin"
                                        style={{
                                          borderColor: "#303030",
                                          borderRightColor: "transparent",
                                          width: "1rem",
                                          height: "1rem",
                                        }}
                                      ></div>
                                    </div>
                                  ) : (
                                    <div>
                                      <button
                                        className="block px-3 py-1 text-sm leading-6 text-gray-900 delete-button"
                                        role="menuitem"
                                        onClick={() =>
                                          handleDeleteClub(club[0])
                                        }
                                        tabIndex="-1"
                                        id={`options-menu-${index}-item-1`}
                                      >
                                        Delete
                                        <span className="sr-only">
                                          , {club[0]}
                                        </span>
                                      </button>
                                      <button
                                        className="block px-3 py-1 text-sm leading-6 text-gray-900 delete-button"
                                        role="menuitem"
                                        onClick={() => handleEditClick(club[0])}
                                        tabIndex="-1"
                                        id={`options-menu-${index}-item-2`}
                                      >
                                        Edit
                                        <span className="sr-only">
                                          , {club[0]}
                                        </span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                      <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">
                            Club Mailing Address
                          </dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Mailing Address",
                                  e.target.value
                                )
                              }
                              defaultValue={club[1]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[1]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club Tourism Region</dt>
                          {editingClub === club[0] ? (
                            <select
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Tourism Region",
                                  e.target.value
                                )
                              }
                              defaultValue={club[2]}
                            >
                              <option selected disabled value="">
                                Select club tourism region
                              </option>
                              <option value="Cariboo Chilcotin Coast">
                                Cariboo Chilcotin Coast
                              </option>
                              <option value="Northern">Northern</option>
                              <option value="Kootenay Rockies">
                                Kootenay Rockies
                              </option>
                              <option value="Thompson Okanagan">
                                Thompson Okanagan
                              </option>
                              <option value="Vancouver Island">
                                Vancouver Island
                              </option>
                              <option value="Vancouver Coast">
                                Vancouver Coast
                              </option>
                            </select>
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[2]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club Main Phone #</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Main Phone",
                                  e.target.value
                                )
                              }
                              defaultValue={club[3]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[3]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club General Email</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club General Email",
                                  e.target.value
                                )
                              }
                              defaultValue={club[4]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[4]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club Website</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Website",
                                  e.target.value
                                )
                              }
                              defaultValue={club[5]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[5]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">
                            Club BC Society Number
                          </dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club BC Society Number",
                                  e.target.value
                                )
                              }
                              defaultValue={club[6]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[6]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">
                            Financial Year End Date
                          </dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Financial Year End Date",
                                  e.target.value
                                )
                              }
                              defaultValue={formatDate(club[7])}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {formatDate(club[7])}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club GST Number</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club GST Number",
                                  e.target.value
                                )
                              }
                              defaultValue={club[8]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[8]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club PST Number</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club PST Number",
                                  e.target.value
                                )
                              }
                              defaultValue={club[9]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[9]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club Facebook</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Facebook",
                                  e.target.value
                                )
                              }
                              defaultValue={club[10]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[10]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club Instagram</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Instagram",
                                  e.target.value
                                )
                              }
                              defaultValue={club[11]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[11]}
                              </div>
                            </dd>
                          )}
                        </div>
                        <div className="flex justify-between gap-x-4 py-3">
                          <dt className="text-gray-500">Club Tik Tok</dt>
                          {editingClub === club[0] ? (
                            <input
                              className="border text-sm rounded-full w-[180px] p-1"
                              onChange={(e) =>
                                handleInputChange(
                                  "Club Tik Tok",
                                  e.target.value
                                )
                              }
                              defaultValue={club[12]}
                            />
                          ) : (
                            <dd className="flex items-start gap-x-2">
                              <div className="font-medium text-gray-900">
                                {club[12]}
                              </div>
                            </dd>
                          )}
                        </div>
                      </dl>
                    </li>
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClubProfile;
