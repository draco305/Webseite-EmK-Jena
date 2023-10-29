+++
# Termin-Titel z.B. in der Terminübersicht
title = "{{ replace .Name "-" " " | title }}"
# Entwurfs-Modus
draft = true
# Ausgabeformate
output = ["JSON", "html"]
# Veröffentlichungsdatum -- Mit diesem Datum wird der Termin in der Übersicht erscheinen
publishdate = {{ .Date }} {{ $date := .Date | time.AsTime }}
# Ende der Veröffentlichung -- Nach Ablauf, wird der Termin aus der Übersicht entfernt
expiryDate = {{ dateFormat "2006-01-02T15:04:05" ( $date.AddDate 0 +1 0) }} # expire date
# Seitentyp: event=Termin
type = 'event'
[event]
  # Ort z.B. in der Terminübersicht
  location = 'Bad Klosterlausnitz'
  # Datum des Termins mit Zeitzone im Format YYYY-MM-DDTHH:MM:SS+ZZ
  date = {{ dateFormat "2006-01-02T15:04:05" ( .Name | title }}
  allday = false
  # Termin-Typ für Bildauswahl
  # z.B. godi-j, godi-bkl, chor-j, posaunen-bkl, senioren-j, engl-bkl, ku
  # Ökumene: st-michael-j, johannis-j, markt-j, bkl, herm, kur-bkl
  # für neue Termin-Typen ein entsprechendes Bild unter static/... ablegen
  type = 'godi-bkl'
+++

