import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
export default function Search() {
  const [sidebarData, setSideBarData] = useState({
    searchTerm: "",
    Type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
const [showMore,setShowMore]=useState(false)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const orderFromUrl = urlParams.get("order");
    if (
      searchTermFromUrl ||
      typeFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      parkingFromUrl ||
      orderFromUrl ||
      furnishedFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        offer: offerFromUrl === "true" ? true : false,
        parking: parkingFromUrl === "true" ? true : false,
        sort: searchTermFromUrl || "creaed_at",
        furnished: furnishedFromUrl === "true" ? true : false,
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false)
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if(data.length>8){
        setShowMore(true)
      }else{
        setShowMore(false)
      }
      setListings(data);

      setLoading(false);
    };
    fetchListings();
  }, [location.search]);
  const navigate = useNavigate();
  console.log(sidebarData);
  const handleChange = (e) => {
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({
        ...sidebarData,
        Type: e.target.id,
      });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({ ...sidebarData, sort, order });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.Type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    urlParams.set("furnished", sidebarData.furnished);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick=async()=>{
    const numberoflistings = listings.length
    const startIndex = numberoflistings
    const urlParams = new URLSearchParams(location.search)
    urlParams.set("startIndex",startIndex)
    const searchQuery = urlParams.toString()

    const res = await fetch(`/api/listing/get?${searchQuery}`)
    const data = await res.json()
    if(data.length<9){
      setShowMore(false)
    }
    setListings({...listings,...data})
    }
  return (
    <div className="flex flex-col  md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              SearchTerm:
            </label>
            <input
              value={sidebarData.searchTerm}
              onChange={handleChange}
              type="text"
              placeholder="Search"
              id="searchTerm"
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-2  flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            <div className="flex gap-2 ">
              <input
                checked={sidebarData.Type === "all"}
                onChange={handleChange}
                type="checkbox"
                id="all"
                className="w-5"
              />
              <span>Rent &Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={sidebarData.Type === "rent"}
                onChange={handleChange}
                type="checkbox"
                id="rent"
                className="w-5"
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={sidebarData.Type === "sale"}
                onChange={handleChange}
                type="checkbox"
                id="sale"
                className="w-5"
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={sidebarData.offer}
                onChange={handleChange}
                type="checkbox"
                id="offer"
                className="w-5"
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-2  flex-wrap items-center">
            <label className="font-semibold">Amanities:</label>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebarData.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2 ">
              <input
                checked={sidebarData.furnished}
                onChange={handleChange}
                type="checkbox"
                id="furnished"
                className="w-5"
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              className="border p-2 rounded-lg"
              id="sort_order"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price lowto hight</option>
              <option value="createdAt_desc">latest</option>
              <option value="createdAt_asc">oldest</option>
            </select>
          </div>
          <button className=" bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Searh
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          {" "}
          Listing Results
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700 ">No listings found</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center  w-full">
              loading...
            </p>
          )}
          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
            {showMore&&(
              <button className="text-green-700 hover:underline p-7" onClick={onShowMoreClick}>
              Show ore
              </button>
            )}
        </div>
      </div>
    </div>
  );
}
