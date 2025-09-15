--
-- PostgreSQL database dump
--

\restrict YytxAE5JoWAgRddn4tTgHugpxBeDZf9GjipLN5nreBlncqUwBKaKMx7XtV91e0H

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: drivers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drivers (
    driver_id integer NOT NULL,
    user_id integer NOT NULL,
    license_no character varying(50) NOT NULL,
    vehicle_no character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'available'::character varying,
    name character varying(100),
    phone character varying(20),
    CONSTRAINT drivers_status_check CHECK (((status)::text = ANY ((ARRAY['available'::character varying, 'on-trip'::character varying])::text[])))
);


ALTER TABLE public.drivers OWNER TO postgres;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drivers_driver_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drivers_driver_id_seq OWNER TO postgres;

--
-- Name: drivers_driver_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drivers_driver_id_seq OWNED BY public.drivers.driver_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    ride_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    method character varying(20) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    paid_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payments_method_check CHECK (((method)::text = ANY ((ARRAY['cash'::character varying, 'card'::character varying, 'wallet'::character varying])::text[]))),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- Name: rides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rides (
    ride_id integer NOT NULL,
    driver_id integer,
    fare numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    dropoff character varying(255),
    pickup character varying(255),
    rider_id integer,
    CONSTRAINT rides_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'ongoing'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[])))
);


ALTER TABLE public.rides OWNER TO postgres;

--
-- Name: rides_ride_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rides_ride_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rides_ride_id_seq OWNER TO postgres;

--
-- Name: rides_ride_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rides_ride_id_seq OWNED BY public.rides.ride_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(100),
    password text NOT NULL,
    role character varying(20) NOT NULL,
    phone character varying(15),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['rider'::character varying, 'driver'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: drivers driver_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers ALTER COLUMN driver_id SET DEFAULT nextval('public.drivers_driver_id_seq'::regclass);


--
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- Name: rides ride_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides ALTER COLUMN ride_id SET DEFAULT nextval('public.rides_ride_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: drivers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drivers (driver_id, user_id, license_no, vehicle_no, status, name, phone) FROM stdin;
1	4	TN09AB1234	TN09XZ7890	available	Ravi Kumar	\N
3	7	TN10AB1234	TN10XZ7890	available	Suresh	123456789
4	9	TN10AC1234	TN10XE7890	available	Danny	9842316121
8	11	TN123456	TN10AB1234	available	\N	\N
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, ride_id, amount, method, status, paid_at) FROM stdin;
\.


--
-- Data for Name: rides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rides (ride_id, driver_id, fare, status, requested_at, user_id, created_at, dropoff, pickup, rider_id) FROM stdin;
8	\N	200.00	pending	2025-09-05 16:37:29.571982	\N	2025-09-05 16:37:29.571982	Velachery	T Nagar	1
10	\N	125.52	pending	2025-09-05 17:20:55.338651	\N	2025-09-05 17:20:55.338651	Marina Beach	Vadapalani	2
11	\N	261.97	pending	2025-09-10 10:32:10.851678	\N	2025-09-10 10:32:10.851678	\N	Chennai Central	2
12	\N	361.08	pending	2025-09-10 10:53:11.322862	\N	2025-09-10 10:53:11.322862	\N	Chennai Central	2
13	\N	495.02	pending	2025-09-10 11:25:29.206076	\N	2025-09-10 11:25:29.206076	Marina Beach	Vadapalani	2
14	\N	177.07	pending	2025-09-10 12:00:10.859374	\N	2025-09-10 12:00:10.859374	Location B	Location A	2
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, phone, created_at) FROM stdin;
1	John Doe	john@example.com	$2b$10$sXbEGmxHGkI2hog/nF9LweiJwKvZnKANnCddCelp6jkBPqIeFLw6.	rider	9876543210	2025-09-05 13:16:40.377039
2	Raja	Raja@example.com	$2b$10$GTGoYsBHmU799.uqP.oDt.CCv0Px3HVpD/NQXfX1ghj8WjKgbG6Ta	rider	1234567899	2025-09-05 17:15:38.510393
4	Ravi Kumar	ravi@example.com	$2b$10$CZRwfKa3LyBho8XpsgduAez/5NthhrGUfVMF6yXOOeh6bBlzF47Ga	driver	12345667	2025-09-08 12:40:38.045901
6	Ravi Kumar	\N	$2b$10$uVUTwikqHy/duisTwT2NR.YO07Imt23Um47cg5BBvvKSJa6.QUU/K	driver	\N	2025-09-08 13:39:58.566107
7	Suresh	\N	$2b$10$YZnQBIz9XRy0Q0k57aGOB.2v9/F8mKXlrsjUfNgEiqVA0bbRJsmtS	driver	\N	2025-09-08 13:42:09.132919
8	Danny	Danny@example.com	$2b$10$72R0aaV1t4XdZUdUHC7dUOiX8o2UHE/M8J5WIULgo2Nb0LlEqprLm	driver	9842316121	2025-09-10 11:37:22.721585
9	Danny	\N	$2b$10$KxGWjFEtQDZhZ3smzWZpoOzhG63kveOGym69pHu9MJssDyz2GCOXK	driver	\N	2025-09-10 11:39:42.691738
11	Pradeep	Pradeep@example.com	$2b$10$Yjk/JOwOlsSoAzi6Udv4AOhKjIealdrv7xKhU63F5SkdBR2BbzJme	driver	8778035290	2025-09-10 11:47:40.636015
17	Sarvesh	Sarvesh@example.com	$2b$10$TOX/nYonOM3264Ow2FK7reitkLM3rtnjGgA7wTbCwJJUx5WcIyhW2	rider	89456123	2025-09-12 16:04:09.141344
\.


--
-- Name: drivers_driver_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drivers_driver_id_seq', 8, true);


--
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 1, false);


--
-- Name: rides_ride_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rides_ride_id_seq', 14, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


--
-- Name: drivers drivers_license_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_license_no_key UNIQUE (license_no);


--
-- Name: drivers drivers_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_phone_key UNIQUE (phone);


--
-- Name: drivers drivers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_pkey PRIMARY KEY (driver_id);


--
-- Name: drivers drivers_vehicle_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_vehicle_no_key UNIQUE (vehicle_no);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- Name: rides rides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_pkey PRIMARY KEY (ride_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: drivers drivers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT drivers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: drivers fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drivers
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payments payments_ride_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_ride_id_fkey FOREIGN KEY (ride_id) REFERENCES public.rides(ride_id) ON DELETE CASCADE;


--
-- Name: rides rides_driver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_driver_id_fkey FOREIGN KEY (driver_id) REFERENCES public.drivers(driver_id) ON DELETE CASCADE;


--
-- Name: rides rides_rider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_rider_id_fkey FOREIGN KEY (rider_id) REFERENCES public.users(id);


--
-- Name: rides rides_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rides
    ADD CONSTRAINT rides_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

\unrestrict YytxAE5JoWAgRddn4tTgHugpxBeDZf9GjipLN5nreBlncqUwBKaKMx7XtV91e0H
