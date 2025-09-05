select * from CONSUMER_PRICE_DAILY
where stand_ymd = '20250710';


SELECT * FROM CONSUMER_PRICE_DAILY
WHERE stand_ymd = '20250710'
ORDER BY DBMS_RANDOM.VALUE
FETCH FIRST 1 ROWS ONLY;



-- 16. 소비자가격(월별)
CREATE TABLE consumer_price_month (
id VARCHAR2(1000) PRIMARY KEY,
stand_ym VARCHAR2(1000),
grade_name VARCHAR2(1000),
judge_kind_name VARCHAR2(1000),
judge_kind VARCHAR2(1000),
item_name VARCHAR2(1000),
item_code VARCHAR2(1000),
unit VARCHAR2(1000),
net_sale_price VARCHAR2(1000),
avg_year_price VARCHAR2(1000),
created_time TIMESTAMP
);

Drop table CONSUMER_PRICE_MONTH;

Drop SEQUENCE consumer_price_month_seq;

CREATE SEQUENCE consumer_price_month_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE OR REPLACE TRIGGER consumer_price_month_trg
BEFORE INSERT ON consumer_price_month
FOR EACH ROW
BEGIN
    SELECT consumer_price_daily_seq.NEXTVAL INTO :new.id FROM dual;
END;

select * from CONSUMER_PRICE_MONTH;


-- daily
select * from CONSUMER_PRICE_DAILY;

 DELETE FROM CONSUMER_PRICE_DAILY;
 
  DROP TABLE CONSUMER_PRICE_DAILY;
  
  DROP SEQUENCE consumer_price_daily_seq;
  
CREATE TABLE consumer_price_daily (
id VARCHAR2(1000) PRIMARY KEY,
stand_ymd VARCHAR2(1000),
grade_name VARCHAR2(1000),
judge_kind_name VARCHAR2(1000),
judge_kind VARCHAR2(1000),
item_name VARCHAR2(1000),
item_code VARCHAR2(1000),
net_sale_price VARCHAR2(1000),
max_price VARCHAR2(1000),
min_price VARCHAR2(1000),
unit VARCHAR2(1000),
created_time TIMESTAMP
);


CREATE SEQUENCE consumer_price_daily_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE OR REPLACE TRIGGER consumer_price_daily_trg
BEFORE INSERT ON consumer_price_daily
FOR EACH ROW
BEGIN
    SELECT consumer_price_daily_seq.NEXTVAL INTO :new.id FROM dual;
END;


-- 17. 소비자가격(연도별)
CREATE TABLE consumer_price_year (
id VARCHAR2(1000) PRIMARY KEY,
year VARCHAR2(1000),
grade_name VARCHAR2(1000),
judge_kind_name VARCHAR2(1000),
judge_kind VARCHAR2(1000),
item_name VARCHAR2(1000),
item_code VARCHAR2(1000),
unit VARCHAR2(1000),
net_sale_price VARCHAR2(1000),
max_price VARCHAR2(1000),
min_price VARCHAR2(1000),
created_time TIMESTAMP
);

select * from consumer_price_year;

  DROP SEQUENCE  consumer_price_year_seq;

CREATE SEQUENCE consumer_price_year_seq
START WITH 1
INCREMENT BY 1
NOCACHE
NOCYCLE;

CREATE OR REPLACE TRIGGER consumer_price_year_trg
BEFORE INSERT ON consumer_price_year
FOR EACH ROW
BEGIN
    SELECT consumer_price_year_seq.NEXTVAL INTO :new.id FROM dual;
END;


