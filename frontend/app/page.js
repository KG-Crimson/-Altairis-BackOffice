"use client";

import { useState, useEffect } from "react";
import styles from "./Home.module.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("hotels");

  // --- Hoteles ---
  const [hotels, setHotels] = useState([]);
  const [hotelIdEditing, setHotelIdEditing] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [hotelCountry, setHotelCountry] = useState("");

  // --- RoomTypes ---
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomIdEditing, setRoomIdEditing] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState(1);
  const [roomHotelId, setRoomHotelId] = useState(1);

  // --- Bookings ---
  const [bookings, setBookings] = useState([]);
  const [bookingIdEditing, setBookingIdEditing] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingHotelId, setBookingHotelId] = useState(1);
  const [bookingRoomTypeId, setBookingRoomTypeId] = useState(1);

  // --- Inventories ---
  const [inventories, setInventories] = useState([]);
  const [inventoryIdEditing, setInventoryIdEditing] = useState(null);
  const [inventoryDate, setInventoryDate] = useState("");
  const [inventoryRooms, setInventoryRooms] = useState(1);
  const [inventoryHotelId, setInventoryHotelId] = useState(1);
  const [inventoryRoomTypeId, setInventoryRoomTypeId] = useState(1);

  // --- Fetch inicial ---
  useEffect(() => {
    fetch("http://localhost:5113/api/Hotels").then(r => r.json()).then(setHotels);
    fetch("http://localhost:5113/api/RoomTypes").then(r => r.json()).then(setRoomTypes);
    fetch("http://localhost:5113/api/Bookings").then(r => r.json()).then(setBookings);
    fetch("http://localhost:5113/api/Inventories").then(r => r.json()).then(setInventories);
  }, []);

  // --- Funciones de Hoteles ---
  const submitHotel = async () => {
    if (hotelIdEditing) {
      const res = await fetch(`http://localhost:5113/api/Hotels/${hotelIdEditing}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: hotelIdEditing, name: hotelName, city: hotelCity, country: hotelCountry})
      });
      const updatedHotel = await res.json();
      setHotels(hotels.map(h => h.id === hotelIdEditing ? updatedHotel : h));
      setHotelIdEditing(null);
    } else {
      const res = await fetch("http://localhost:5113/api/Hotels", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: hotelName, city: hotelCity, country: hotelCountry})
      });
      const data = await res.json();
      setHotels([...hotels, data]);
    }
    setHotelName(""); setHotelCity(""); setHotelCountry("");
  };
  const editHotel = (hotel) => {
    setHotelIdEditing(hotel.id);
    setHotelName(hotel.name);
    setHotelCity(hotel.city);
    setHotelCountry(hotel.country);
  };
  const deleteHotel = async (id) => {
    await fetch(`http://localhost:5113/api/Hotels/${id}`, {method:"DELETE"});
    setHotels(hotels.filter(h => h.id !== id));
  };

  // --- Funciones RoomTypes ---
  const submitRoomType = async () => {
    if (roomIdEditing) {
      const res = await fetch(`http://localhost:5113/api/RoomTypes/${roomIdEditing}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id: roomIdEditing, name: roomName, capacity: roomCapacity, hotelId: roomHotelId})
      });
      const updated = await res.json();
      setRoomTypes(roomTypes.map(r => r.id === roomIdEditing ? updated : r));
      setRoomIdEditing(null);
    } else {
      const res = await fetch("http://localhost:5113/api/RoomTypes", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name: roomName, capacity: roomCapacity, hotelId: roomHotelId})
      });
      const data = await res.json();
      setRoomTypes([...roomTypes, data]);
    }
    setRoomName(""); setRoomCapacity(1); setRoomHotelId(1);
  };
  const editRoomType = (r) => {
    setRoomIdEditing(r.id);
    setRoomName(r.name);
    setRoomCapacity(r.capacity);
    setRoomHotelId(r.hotelId);
  };
  const deleteRoomType = async (id) => {
    await fetch(`http://localhost:5113/api/RoomTypes/${id}`, {method:"DELETE"});
    setRoomTypes(roomTypes.filter(r => r.id !== id));
  };

  // --- Funciones Bookings ---
  const submitBooking = async () => {
    if (bookingIdEditing) {
      const res = await fetch(`http://localhost:5113/api/Bookings/${bookingIdEditing}`, {
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          id: bookingIdEditing,
          guestName, checkIn, checkOut, hotelId: bookingHotelId, roomTypeId: bookingRoomTypeId, status: "Pending"
        })
      });
      const updated = await res.json();
      setBookings(bookings.map(b => b.id === bookingIdEditing ? updated : b));
      setBookingIdEditing(null);
    } else {
      const res = await fetch("http://localhost:5113/api/Bookings", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          guestName, checkIn, checkOut, hotelId: bookingHotelId, roomTypeId: bookingRoomTypeId, status: "Pending"
        })
      });
      const data = await res.json();
      setBookings([...bookings, data]);
    }
    setGuestName(""); setCheckIn(""); setCheckOut(""); setBookingHotelId(1); setBookingRoomTypeId(1);
  };
  const editBooking = (b) => {
    setBookingIdEditing(b.id);
    setGuestName(b.guestName);
    setCheckIn(b.checkIn.split("T")[0]);
    setCheckOut(b.checkOut.split("T")[0]);
    setBookingHotelId(b.hotelId);
    setBookingRoomTypeId(b.roomTypeId);
  };
  const deleteBooking = async (id) => {
    await fetch(`http://localhost:5113/api/Bookings/${id}`, {method:"DELETE"});
    setBookings(bookings.filter(b => b.id !== id));
  };

  // --- Funciones Inventories ---
  const submitInventory = async () => {
    if (inventoryIdEditing) {
      const res = await fetch(`http://localhost:5113/api/Inventories/${inventoryIdEditing}`, {
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          id: inventoryIdEditing,
          date: inventoryDate, availableRooms: inventoryRooms, hotelId: inventoryHotelId, roomTypeId: inventoryRoomTypeId
        })
      });
      const updated = await res.json();
      setInventories(inventories.map(i => i.id === inventoryIdEditing ? updated : i));
      setInventoryIdEditing(null);
    } else {
      const res = await fetch("http://localhost:5113/api/Inventories", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          date: inventoryDate, availableRooms: inventoryRooms, hotelId: inventoryHotelId, roomTypeId: inventoryRoomTypeId
        })
      });
      const data = await res.json();
      setInventories([...inventories, data]);
    }
    setInventoryDate(""); setInventoryRooms(1); setInventoryHotelId(1); setInventoryRoomTypeId(1);
  };
  const editInventory = (i) => {
    setInventoryIdEditing(i.id);
    setInventoryDate(i.date.split("T")[0]);
    setInventoryRooms(i.availableRooms);
    setInventoryHotelId(i.hotelId);
    setInventoryRoomTypeId(i.roomTypeId);
  };
  const deleteInventory = async (id) => {
    await fetch(`http://localhost:5113/api/Inventories/${id}`, {method:"DELETE"});
    setInventories(inventories.filter(i => i.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Altairis BackOffice</h1>

      {/* --- Tabs tipo tarjetas --- */}
      <div className={styles.tabs}>
        <button className={`${styles.tabButton} ${activeTab==="hotels"?styles.tabButtonActive:""}`} onClick={()=>setActiveTab("hotels")}>Hoteles</button>
        <button className={`${styles.tabButton} ${activeTab==="roomTypes"?styles.tabButtonActive:""}`} onClick={()=>setActiveTab("roomTypes")}>Habitaciones</button>
        <button className={`${styles.tabButton} ${activeTab==="bookings"?styles.tabButtonActive:""}`} onClick={()=>setActiveTab("bookings")}>Bookings</button>
        <button className={`${styles.tabButton} ${activeTab==="inventories"?styles.tabButtonActive:""}`} onClick={()=>setActiveTab("inventories")}>Inventarios</button>
      </div>

      {/* --- Sección activa --- */}
      {activeTab === "hotels" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} placeholder="Nombre" value={hotelName} onChange={e=>setHotelName(e.target.value)} />
            <input className={styles.input} placeholder="Ciudad" value={hotelCity} onChange={e=>setHotelCity(e.target.value)} />
            <input className={styles.input} placeholder="País" value={hotelCountry} onChange={e=>setHotelCountry(e.target.value)} />
            <button className={styles.button} onClick={submitHotel}>
              {hotelIdEditing ? "Actualizar Hotel" : "Crear Hotel"}
            </button>
          </div>
          <table className={styles.table}>
            <thead><tr><th>Nombre</th><th>Ciudad</th><th>País</th><th>Acciones</th></tr></thead>
            <tbody>
              {hotels.map(h => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.city}</td>
                  <td>{h.country}</td>
                  <td>
                    <button className={styles.button} onClick={()=>editHotel(h)}>Editar</button>
                    <button className={`${styles.button} ${styles.buttonDelete}`} onClick={()=>deleteHotel(h.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "roomTypes" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} placeholder="Nombre" value={roomName} onChange={e=>setRoomName(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Capacidad" value={roomCapacity} onChange={e=>setRoomCapacity(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Hotel ID" value={roomHotelId} onChange={e=>setRoomHotelId(e.target.value)} />
            <button className={styles.button} onClick={submitRoomType}>
              {roomIdEditing ? "Actualizar RoomType" : "Crear RoomType"}
            </button>
          </div>
          <table className={styles.table}>
            <thead><tr><th>Nombre</th><th>Capacidad</th><th>Hotel ID</th><th>Acciones</th></tr></thead>
            <tbody>
              {roomTypes.map(r => (
                <tr key={r.id}>
                  <td>{r.name}</td>
                  <td>{r.capacity}</td>
                  <td>{r.hotelId}</td>
                  <td>
                    <button className={styles.button} onClick={()=>editRoomType(r)}>Editar</button>
                    <button className={`${styles.button} ${styles.buttonDelete}`} onClick={()=>deleteRoomType(r.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} placeholder="Guest Name" value={guestName} onChange={e=>setGuestName(e.target.value)} />
            <input className={styles.input} type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} />
            <input className={styles.input} type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Hotel ID" value={bookingHotelId} onChange={e=>setBookingHotelId(e.target.value)} />
            <input className={styles.input} type="number" placeholder="RoomType ID" value={bookingRoomTypeId} onChange={e=>setBookingRoomTypeId(e.target.value)} />
            <button className={styles.button} onClick={submitBooking}>
              {bookingIdEditing ? "Actualizar Booking" : "Crear Booking"}
            </button>
          </div>
          <table className={styles.table}>
            <thead><tr><th>Guest</th><th>CheckIn</th><th>CheckOut</th><th>Hotel</th><th>RoomType</th><th>Acciones</th></tr></thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td>{b.guestName}</td>
                  <td>{b.checkIn.split("T")[0]}</td>
                  <td>{b.checkOut.split("T")[0]}</td>
                  <td>{b.hotelId}</td>
                  <td>{b.roomTypeId}</td>
                  <td>
                    <button className={styles.button} onClick={()=>editBooking(b)}>Editar</button>
                    <button className={`${styles.button} ${styles.buttonDelete}`} onClick={()=>deleteBooking(b.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "inventories" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} type="date" value={inventoryDate} onChange={e=>setInventoryDate(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Available Rooms" value={inventoryRooms} onChange={e=>setInventoryRooms(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Hotel ID" value={inventoryHotelId} onChange={e=>setInventoryHotelId(e.target.value)} />
            <input className={styles.input} type="number" placeholder="RoomType ID" value={inventoryRoomTypeId} onChange={e=>setInventoryRoomTypeId(e.target.value)} />
            <button className={styles.button} onClick={submitInventory}>
              {inventoryIdEditing ? "Actualizar Inventory" : "Crear Inventory"}
            </button>
          </div>
          <table className={styles.table}>
            <thead><tr><th>Date</th><th>Rooms</th><th>Hotel</th><th>RoomType</th><th>Acciones</th></tr></thead>
            <tbody>
              {inventories.map(i => (
                <tr key={i.id}>
                  <td>{i.date.split("T")[0]}</td>
                  <td>{i.availableRooms}</td>
                  <td>{i.hotelId}</td>
                  <td>{i.roomTypeId}</td>
                  <td>
                    <button className={styles.button} onClick={()=>editInventory(i)}>Editar</button>
                    <button className={`${styles.button} ${styles.buttonDelete}`} onClick={()=>deleteInventory(i.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
