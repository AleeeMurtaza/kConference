--
-- PostgreSQL database dump
--


-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-03-25 12:19:25

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
-- TOC entry 222 (class 1259 OID 24631)
-- Name: papers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.papers (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    file_path text NOT NULL,
    author_id integer,
    status character varying(20) DEFAULT 'Pending'::character varying,
    reviewer_comments text,
    submitted_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.papers OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 24630)
-- Name: papers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.papers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.papers_id_seq OWNER TO postgres;

--
-- TOC entry 5028 (class 0 OID 0)
-- Dependencies: 221
-- Name: papers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.papers_id_seq OWNED BY public.papers.id;


--
-- TOC entry 220 (class 1259 OID 24617)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24616)
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
-- TOC entry 5029 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4862 (class 2604 OID 24634)
-- Name: papers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.papers ALTER COLUMN id SET DEFAULT nextval('public.papers_id_seq'::regclass);


--
-- TOC entry 4861 (class 2604 OID 24620)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5022 (class 0 OID 24631)
-- Dependencies: 222
-- Data for Name: papers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.papers (id, title, file_path, author_id, status, reviewer_comments, submitted_at) FROM stdin;
1	1234	uploads\\1774439970637-report.pdf	1	Approved	done	2026-03-25 11:59:30.749785
\.


--
-- TOC entry 5020 (class 0 OID 24617)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, email, password, role) FROM stdin;
1	Ali	Alitest@gmail.com	$2b$10$cdmpsCLyU6U5vkeqdOVmpu2kniSdF5u5G3bdr7VwMlTDmRO6e6Vmi	Author
2	zaid#	Alitest1@gmail.com	$2b$10$F1l8jUfMT5bY2X268oBy9u8f/bxXybBMWrDDrg2VPJc2yJeyMmGpa	Reviewer
3	zain	Alitest2@gmail.com	$2b$10$7AmKOvzZmRo.oEB7A6/k9uvNeo/o3pp0OqPmEt5Wp3Rb7OM9fTpbe	Organiser
\.


--
-- TOC entry 5030 (class 0 OID 0)
-- Dependencies: 221
-- Name: papers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.papers_id_seq', 1, true);


--
-- TOC entry 5031 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- TOC entry 4870 (class 2606 OID 24643)
-- Name: papers papers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.papers
    ADD CONSTRAINT papers_pkey PRIMARY KEY (id);


--
-- TOC entry 4866 (class 2606 OID 24629)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4868 (class 2606 OID 24627)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4871 (class 2606 OID 24644)
-- Name: papers papers_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.papers
    ADD CONSTRAINT papers_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id);


-- Completed on 2026-03-25 12:19:25

--
-- PostgreSQL database dump complete
--


