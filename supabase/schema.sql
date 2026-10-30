-- Archivio pubblico SDA Scritte. Tabelle degli altri progetti non modificate.
create table if not exists public.sda_public_signs (id text primary key,label text not null unique check(char_length(label) between 1 and 80),hub text not null,pdf_path text not null check(pdf_path ~ '^/pdf/[a-z0-9-]+\.pdf$'),sort_order integer not null default 0);
alter table public.sda_public_signs enable row level security;
grant select on public.sda_public_signs to anon, authenticated;
revoke insert, update, delete on public.sda_public_signs from anon, authenticated;
drop policy if exists "Anyone can read SDA signs" on public.sda_public_signs;
create policy "Anyone can read SDA signs" on public.sda_public_signs for select to anon, authenticated using (true);
insert into public.sda_public_signs (id,label,hub,pdf_path,sort_order) values
('cosenza','COSENZA','Calabria','/pdf/cosenza.pdf',0),
('catanzaro','CATANZARO','Calabria','/pdf/catanzaro.pdf',1),
('reggio-calabria','REGGIO CALABRIA','Calabria','/pdf/reggio-calabria.pdf',2),
('hb2-fly','HB2 FLY','FLY','/pdf/hb2-fly.pdf',3),
('hb2-coy','HB2 COY','COY','/pdf/hb2-coy.pdf',4),
('hp3-fly','HP3 FLY','FLY','/pdf/hp3-fly.pdf',5),
('hp3-coy','HP3 COY','COY','/pdf/hp3-coy.pdf',6),
('hm4-fly','HM4 FLY','FLY','/pdf/hm4-fly.pdf',7),
('hm4-coy','HM4 COY','COY','/pdf/hm4-coy.pdf',8),
('hq2-fly','HQ2 FLY','FLY','/pdf/hq2-fly.pdf',9),
('hq2-coy','HQ2 COY','COY','/pdf/hq2-coy.pdf',10),
('hr2-fly','HR2 FLY','FLY','/pdf/hr2-fly.pdf',11),
('hr2-coy','HR2 COY','COY','/pdf/hr2-coy.pdf',12),
('prodotto-lento','PRODOTTO LENTO','Altre','/pdf/prodotto-lento.pdf',13),
('hb-amazon-reverse','HB AMAZON REVERSE','Reverse','/pdf/hb-amazon-reverse.pdf',14),
('hb-reverse-yoox','HB REVERSE YOOX','Reverse','/pdf/hb-reverse-yoox.pdf',15),
('hp-rev','HP REV','Reverse','/pdf/hp-rev.pdf',16),
('uca-salerno','UCA SALERNO','Altre','/pdf/uca-salerno.pdf',17)
on conflict (id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;

insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values
('my-da-potenza','MY DA POTENZA','Altre','/pdf/my-da-potenza.pdf',18)
on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;

delete from public.sda_public_signs where id='gtw-lonate';

insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('hm-eurodis','HM EURODIS','Altre','/pdf/hm-eurodis.pdf',19),('hp3','HP3','Altre','/pdf/hp3.pdf',20) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;

delete from public.sda_public_signs where id in ('hp3-to-eurodis','hb-reverse-yhoox');

alter table public.sda_public_signs drop constraint if exists sda_public_signs_pdf_path_check;
alter table public.sda_public_signs add constraint sda_public_signs_pdf_path_check check (pdf_path ~ '^/pdf/[a-z0-9-]+[.]pdf$' or (id='hw-reverse-zalando' and pdf_path='/print-zalando.html'));
insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('hw-reverse-zalando','HW REVERSE ZALANDO','Reverse','/print-zalando.html',21) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;

update public.sda_public_signs set hub='HUB' where hub in ('FLY','COY');

update public.sda_public_signs set hub='Internazionale' where id in ('my-da-potenza','hm-eurodis');
insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('hp3-to-eurodis','HP3 TO EURODIS','Internazionale','/pdf/hp3-to-eurodis.pdf',20) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;
delete from public.sda_public_signs where id='hp3';

insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('foglio-banche','FOGLIO BANCHE','Banche','/pdf/foglio-banche.pdf',22),('poste-prodotto-lento','POSTE PRODOTTO LENTO','Altre','/pdf/poste-prodotto-lento.pdf',13) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;
delete from public.sda_public_signs where id='prodotto-lento';

insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('hr-da-trabalzare','HR DA TRABALZARE','Altre','/pdf/hr-da-trabalzare.pdf',23) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;

alter table public.sda_public_signs drop constraint if exists sda_public_signs_pdf_path_check;
alter table public.sda_public_signs add constraint sda_public_signs_pdf_path_check check (pdf_path ~ '^/pdf/[a-z0-9-]+[.]pdf$' or (id='hw-reverse-zalando' and pdf_path='/print-zalando.html') or (id='foglio-banche' and pdf_path='/print-banche.html') or (id='poste-prodotto-lento' and pdf_path='/print-poste-lento.html'));
update public.sda_public_signs set pdf_path='/print-banche.html' where id='foglio-banche';
update public.sda_public_signs set pdf_path='/print-poste-lento.html' where id='poste-prodotto-lento';

insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('prodotto-lento','PRODOTTO LENTO','Altre','/pdf/prodotto-lento.pdf',24) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;

insert into public.sda_public_signs(id,label,hub,pdf_path,sort_order) values ('potenza-x-roma1-banche','POTENZA X ROMA1 BANCHE','Banche','/pdf/potenza-x-roma1-banche.pdf',25) on conflict(id) do update set label=excluded.label,hub=excluded.hub,pdf_path=excluded.pdf_path,sort_order=excluded.sort_order;
