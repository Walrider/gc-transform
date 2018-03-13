This app accept CSV file with events data(location in spcs format, type and date) transform geo-data in LatLng format and displays in on the google map with filtering options.

Currently only Texas SPCS projection available. Feel free to add more to config file(proj4js format).

For proper functioning of the app you need to have:
1. Formatted CSV file to import
2. Google Developers Console API key

Instructions:
1. Add you Google API key in config file;
2. Run 'npm start' while being in project folder;
3. Open localhost:3000 or other port of your choice(configurable);
4. Import CSV file;
5. Play around with your data nicely displayed on Google Maps.
