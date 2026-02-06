"use client";

import { useState, useEffect } from "react";
import styles from "./Home.module.css";

export default function Home() {
  // Tamaño fijo para paginacion.
  const pageSize = 10;
  const [activeTab, setActiveTab] = useState("hotels");

  // --- Hoteles ---
  const [hotels, setHotels] = useState([]);
  const [hotelsPage, setHotelsPage] = useState(1);
  const [hotelsTotal, setHotelsTotal] = useState(0);
  const [hotelIdEditing, setHotelIdEditing] = useState(null);
  const [hotelName, setHotelName] = useState("");
  const [hotelCity, setHotelCity] = useState("");
  const [hotelCountry, setHotelCountry] = useState("");

  // --- RoomTypes ---
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomTypesPage, setRoomTypesPage] = useState(1);
  const [roomTypesTotal, setRoomTypesTotal] = useState(0);
  const [roomIdEditing, setRoomIdEditing] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState(1);
  const [roomHotelId, setRoomHotelId] = useState(1);

  // --- Bookings ---
  const [bookings, setBookings] = useState([]);
  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsTotal, setBookingsTotal] = useState(0);
  const [bookingIdEditing, setBookingIdEditing] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [bookingHotelId, setBookingHotelId] = useState(1);
  const [bookingRoomTypeId, setBookingRoomTypeId] = useState(1);

  // --- Inventories ---
  const [inventories, setInventories] = useState([]);
  const [inventoriesPage, setInventoriesPage] = useState(1);
  const [inventoriesTotal, setInventoriesTotal] = useState(0);
  const [inventoryIdEditing, setInventoryIdEditing] = useState(null);
  const [inventoryDate, setInventoryDate] = useState("");
  const [inventoryRooms, setInventoryRooms] = useState(1);
  const [inventoryHotelId, setInventoryHotelId] = useState(1);
  const [inventoryRoomTypeId, setInventoryRoomTypeId] = useState(1);

  const parsePage = (data) => {
    // Soporta respuestas antiguas (array) y nuevas (objeto paginado).
    if (Array.isArray(data)) {
      return { items: data, total: data.length, page: 1, pageSize: data.length };
    }
    return data ?? { items: [], total: 0, page: 1, pageSize };
  };

  const fetchHotels = async () => {
    const res = await fetch(`http://localhost:5113/api/Hotels?page=${hotelsPage}&pageSize=${pageSize}`);
    const data = parsePage(await res.json());
    setHotels(data.items || []);
    setHotelsTotal(data.total || 0);
  };

  const fetchRoomTypes = async () => {
    const res = await fetch(`http://localhost:5113/api/RoomTypes?page=${roomTypesPage}&pageSize=${pageSize}`);
    const data = parsePage(await res.json());
    setRoomTypes(data.items || []);
    setRoomTypesTotal(data.total || 0);
  };

  const fetchBookings = async () => {
    const res = await fetch(`http://localhost:5113/api/Bookings?page=${bookingsPage}&pageSize=${pageSize}`);
    const data = parsePage(await res.json());
    setBookings(data.items || []);
    setBookingsTotal(data.total || 0);
  };

  const fetchInventories = async () => {
    const res = await fetch(`http://localhost:5113/api/Inventories?page=${inventoriesPage}&pageSize=${pageSize}`);
    const data = parsePage(await res.json());
    setInventories(data.items || []);
    setInventoriesTotal(data.total || 0);
  };

  // --- Fetch inicial y paginado ---
  useEffect(() => {
    fetchHotels();
    fetchRoomTypes();
    fetchBookings();
    fetchInventories();
  }, [hotelsPage, roomTypesPage, bookingsPage, inventoriesPage]);

  // --- Funciones de Hoteles ---
  const submitHotel = async () => {
    if (hotelIdEditing) {
      await fetch(`http://localhost:5113/api/Hotels/${hotelIdEditing}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({id: hotelIdEditing, name: hotelName, city: hotelCity, country: hotelCountry})
      });
      await fetchHotels();
      setHotelIdEditing(null);
    } else {
      await fetch("http://localhost:5113/api/Hotels", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: hotelName, city: hotelCity, country: hotelCountry})
      });
      await fetchHotels();
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
    await fetchHotels();
  };

  // --- Funciones RoomTypes ---
  const submitRoomType = async () => {
    if (roomIdEditing) {
      await fetch(`http://localhost:5113/api/RoomTypes/${roomIdEditing}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({id: roomIdEditing, name: roomName, capacity: roomCapacity, hotelId: roomHotelId})
      });
      await fetchRoomTypes();
      setRoomIdEditing(null);
    } else {
      await fetch("http://localhost:5113/api/RoomTypes", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({name: roomName, capacity: roomCapacity, hotelId: roomHotelId})
      });
      await fetchRoomTypes();
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
    await fetchRoomTypes();
  };

  // --- Funciones Bookings ---
  const submitBooking = async () => {
    if (bookingIdEditing) {
      await fetch(`http://localhost:5113/api/Bookings/${bookingIdEditing}`, {
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          id: bookingIdEditing,
          guestName, checkIn, checkOut, hotelId: bookingHotelId, roomTypeId: bookingRoomTypeId, status: "Pending"
        })
      });
      await fetchBookings();
      setBookingIdEditing(null);
    } else {
      await fetch("http://localhost:5113/api/Bookings", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          guestName, checkIn, checkOut, hotelId: bookingHotelId, roomTypeId: bookingRoomTypeId, status: "Pending"
        })
      });
      await fetchBookings();
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
    await fetchBookings();
  };

  // --- Funciones Inventories ---
  const submitInventory = async () => {
    if (inventoryIdEditing) {
      await fetch(`http://localhost:5113/api/Inventories/${inventoryIdEditing}`, {
        method:"PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          id: inventoryIdEditing,
          date: inventoryDate, availableRooms: inventoryRooms, hotelId: inventoryHotelId, roomTypeId: inventoryRoomTypeId
        })
      });
      await fetchInventories();
      setInventoryIdEditing(null);
    } else {
      await fetch("http://localhost:5113/api/Inventories", {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          date: inventoryDate, availableRooms: inventoryRooms, hotelId: inventoryHotelId, roomTypeId: inventoryRoomTypeId
        })
      });
      await fetchInventories();
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
    await fetchInventories();
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

      {/* --- Seccion activa --- */}
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
          <div className={styles.pagination}>
            <button className={styles.paginationButton} onClick={() => setHotelsPage(p => Math.max(1, p - 1))} disabled={hotelsPage <= 1}>Anterior</button>
            <div className={styles.paginationInfo}>Pagina {hotelsPage} de {Math.max(1, Math.ceil(hotelsTotal / pageSize))}</div>
            <button className={styles.paginationButton} onClick={() => setHotelsPage(p => Math.min(Math.max(1, Math.ceil(hotelsTotal / pageSize)), p + 1))} disabled={hotelsPage >= Math.max(1, Math.ceil(hotelsTotal / pageSize))}>Siguiente</button>
          </div>
        </div>
      )}

      {activeTab === "roomTypes" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} placeholder="Nombre" value={roomName} onChange={e=>setRoomName(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Capacidad" value={roomCapacity} onChange={e=>setRoomCapacity(Number(e.target.value))} />
            <input className={styles.input} type="number" placeholder="Hotel ID" value={roomHotelId} onChange={e=>setRoomHotelId(Number(e.target.value))} />
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
          <div className={styles.pagination}>
            <button className={styles.paginationButton} onClick={() => setRoomTypesPage(p => Math.max(1, p - 1))} disabled={roomTypesPage <= 1}>Anterior</button>
            <div className={styles.paginationInfo}>Pagina {roomTypesPage} de {Math.max(1, Math.ceil(roomTypesTotal / pageSize))}</div>
            <button className={styles.paginationButton} onClick={() => setRoomTypesPage(p => Math.min(Math.max(1, Math.ceil(roomTypesTotal / pageSize)), p + 1))} disabled={roomTypesPage >= Math.max(1, Math.ceil(roomTypesTotal / pageSize))}>Siguiente</button>
          </div>
        </div>
      )}

      {activeTab === "bookings" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} placeholder="Guest Name" value={guestName} onChange={e=>setGuestName(e.target.value)} />
            <input className={styles.input} type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)} />
            <input className={styles.input} type="date" value={checkOut} onChange={e=>setCheckOut(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Hotel ID" value={bookingHotelId} onChange={e=>setBookingHotelId(Number(e.target.value))} />
            <input className={styles.input} type="number" placeholder="RoomType ID" value={bookingRoomTypeId} onChange={e=>setBookingRoomTypeId(Number(e.target.value))} />
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
          <div className={styles.pagination}>
            <button className={styles.paginationButton} onClick={() => setBookingsPage(p => Math.max(1, p - 1))} disabled={bookingsPage <= 1}>Anterior</button>
            <div className={styles.paginationInfo}>Pagina {bookingsPage} de {Math.max(1, Math.ceil(bookingsTotal / pageSize))}</div>
            <button className={styles.paginationButton} onClick={() => setBookingsPage(p => Math.min(Math.max(1, Math.ceil(bookingsTotal / pageSize)), p + 1))} disabled={bookingsPage >= Math.max(1, Math.ceil(bookingsTotal / pageSize))}>Siguiente</button>
          </div>
        </div>
      )}

      {activeTab === "inventories" && (
        <div className={styles.section}>
          <div className={styles.form}>
            <input className={styles.input} type="date" value={inventoryDate} onChange={e=>setInventoryDate(e.target.value)} />
            <input className={styles.input} type="number" placeholder="Available Rooms" value={inventoryRooms} onChange={e=>setInventoryRooms(Number(e.target.value))} />
            <input className={styles.input} type="number" placeholder="Hotel ID" value={inventoryHotelId} onChange={e=>setInventoryHotelId(Number(e.target.value))} />
            <input className={styles.input} type="number" placeholder="RoomType ID" value={inventoryRoomTypeId} onChange={e=>setInventoryRoomTypeId(Number(e.target.value))} />
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
          <div className={styles.pagination}>
            <button className={styles.paginationButton} onClick={() => setInventoriesPage(p => Math.max(1, p - 1))} disabled={inventoriesPage <= 1}>Anterior</button>
            <div className={styles.paginationInfo}>Pagina {inventoriesPage} de {Math.max(1, Math.ceil(inventoriesTotal / pageSize))}</div>
            <button className={styles.paginationButton} onClick={() => setInventoriesPage(p => Math.min(Math.max(1, Math.ceil(inventoriesTotal / pageSize)), p + 1))} disabled={inventoriesPage >= Math.max(1, Math.ceil(inventoriesTotal / pageSize))}>Siguiente</button>
          </div>
        </div>
      )}

    </div>
  );
}
