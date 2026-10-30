# SDA Scritte

Archivio pubblico senza credenziali, con 23 riquadri cliccabili e PDF A4 separati. Ogni PDF contiene due copie della stessa scritta in Helvetica Bold, carattere largo in grassetto, grandi e centrate, con una linea di taglio a met√† foglio.

## Avvio

Node.js 22 o successivo e pnpm 10.28.2. Eseguire `pnpm install`, `pnpm dev`. Per la pubblicazione: `pnpm build`, cartella `dist`.

## Render

Creare un **Static Site** dal repository `Mixet01/sda-scritte`. Il file `render.yaml` configura build e cartella pubblica. Build: `pnpm install --frozen-lockfile && pnpm build`. Publish directory: `dist`. Nessuna chiave segreta da configurare.

## Supabase

Il progetto SDA contiene la tabella dedicata `public.sda_public_signs`. L'accesso pubblico √® di sola lettura, protetto da RLS. Non sono presenti login, registrazioni o area amministrativa. Il frontend usa esclusivamente una chiave pubblicabile. I PDF sono pubblicati su Render insieme al sito; una copia dell'archivio √® inclusa per consentire la stampa anche se Supabase non risponde.

Le modifiche a `src/destinations.js` richiedono una build per generare i PDF. Allineare i dati di `sda_public_signs` se si aggiungono o rinominano scritte. Non inserire nel database percorsi PDF che non siano gi√† stati pubblicati.

## Verifiche

`pnpm test` controlla corrispondenza delle 23 diciture, PDF distinti e dimensioni A4. `python scripts/verify-pdfs.py` (PyMuPDF e Pillow) verifica il testo due volte, grassetto, margini, dimensioni e genera una tavola di controllo in `test-results/`.

## Stampa

Aprire il riquadro, poi usare il comando Stampa del lettore PDF. Carta A4 verticale, scala 100% o dimensioni effettive, una pagina per foglio. Per tutte le scritte vengono stampate due copie sullo stesso foglio.

## Interfaccia e aggiornamenti automatici

Categorie HUB, Calabria, Reverse, Banche, Internazionale e Altre con filtri. Nei riquadri compare soltanto la nomenclatura. La pagina controlla dati e versione ogni 30 secondi mentre Ë visibile e quando si torna alla scheda. Una nuova versione grafica viene caricata automaticamente dopo aver verificato che il nuovo HTML sia disponibile. Render deve inviare `Cache-Control: no-store`, configurato nel servizio e in `render.yaml`. Le pagine che erano gi‡ aperte prima dellíintroduzione di questa funzione devono essere ricaricate una volta.

Logo SDA Poste Italiane: https://commons.wikimedia.org/wiki/File:SDA_poste_logo.svg (PD-textlogo). Schermata iniziale con logo di sfondo; selezionare una categoria per mostrare i PDF. Clic sul logo in alto per tornare alla schermata iniziale.

HW REVERSE ZALANDO (Reverse) genera un nuovo PDF allíapertura con la data corrente in Europe/Rome, ripetuta sotto ciascuna delle due scritte. Nessuna automazione giornaliera o nuova pubblicazione richiesta. Il riquadro aggiorna la data alla mezzanotte italiana, entro il controllo di 30 secondi o tornando alla scheda. Un PDF gi‡ scaricato resta un documento statico: riaprirlo dal sito per ottenere la data del nuovo giorno.

HUB unisce FLY e COY, ordinati per codice (HB2, HM4, HP3, HQ2, HR2), con FLY e COY affiancati per ogni codice.

Ogni parola della nomenclatura occupa una riga separata (esempio: HB / AMAZON / REVERSE), su entrambe le copie A4. Anche il PDF giornaliero Zalando usa il carattere largo e una parola per riga.

Etichetta Zalando aggiornata sulla foto di riferimento: logo, REVERSE, da Potenza, destino HUB PIACENZA (ZA) e data giornaliera; due etichette affiancate in una composizione orizzontale, ruotate fisicamente di 90 gradi in una pagina A4 verticale senza flag di rotazione. Stampare A4 verticale al 100%. Logo: https://commons.wikimedia.org/wiki/File:Zalando_Logo.png (PD-textlogo).

Internazionale contiene MY DA POTENZA, HM EURODIS e HP3 TO EURODIS; Banche Ë disponibile come sezione vuota in attesa delle sue scritte.

FOGLIO BANCHE: PDF di quattro pagine A4, ricreato dalle foto Foglio1-4, dati trascritti in data/foglio-banche.json. Colonne DATA, ISTITUTO, LOCALITA, INDIRIZZO, BOLGETTA e ASSEGNI. POSTE PRODOTTO LENTO sostituisce il precedente PRODOTTO LENTO: modulo KANBAN AVVIAMENTO PACCHI ricreato dalla foto con due copie su A4, data e hub di destinazione vuoti. Entrambi vengono generati da scripts/generate-special-pdfs.mjs durante la build.
