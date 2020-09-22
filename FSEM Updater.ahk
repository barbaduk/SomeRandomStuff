#SingleInstance, Force
#NoTrayIcon

ComObjError(false)
whr := ComObjCreate("WinHttp.WinHttpRequest.5.1")
;Берём ссылку на docx из моего гитхаба (Если она изменится на сайте, достаточно будет мне опубликовать новую, а не править код)
whr.Open("GET", "https://github.com/barbaduk/SomeRandomStuff/raw/master/FSEM-link", true)
whr.Send()
whr.WaitForResponse()
fsemlink := StrReplace(whr.ResponseText, "`n")
whr.Open("GET", fsemlink)
whr.Send()
whr.WaitForResponse()
checkfile := whr.ResponseText
;Проверка ссылки перед скачкой. Если файла по ссылке нет, то в ответ придёт ошибка, содержащая "html".
IfNotInString, checkfile, html
{
;Копирует сам себя в папку "C:\users\public\FSEM Updater\" (Если файл и папка уже существуют, то соответствующее действие пропускается).
;Это нужно, чтобы Планировщик не ссылался на тот файл, который был изначально запущен (вдруг его удалят), а так можно просто с флешки "установить".
;Такой путь выбрал, потому что для копирования не нужны права администратора + пользователь туда вряд ли полезет.
	fldr = %public%\FSEM Updater\
	If !FileExist(fldr)
		FileCreateDir, %fldr%
	If !FileExist(fldr A_ScriptName)
		FileCopy, %A_ScriptFullPath%, %fldr%
	If !FileExist(fldr "Custom folder.ini")
		FileAppend, , %fldr%Custom folder.ini
;Если в Планировщике нет задачи с именем "FSEM Updater", то создаём её (соответственно, отрабатывает только при первом запуске)
	RunWait, %A_WinDir%\System32\schtasks.exe /TN "FSEM Updater", , UseErrorLevel
	if ErrorLevel
		Run, powershell -Command "$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Tue -At "13:00" -WeeksInterval 2;$o = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -WakeToRun;$a = New-ScheduledTaskAction -Execute "'%fldr%%A_ScriptName%'";Register-ScheduledTask -TaskName 'FSEM Updater' -Trigger $t -Settings $o -Action $a", , hide
;Собственно само скачивание. Так же есть функция скачивания не на рабочий стол, если в файле "...\FSEM Updater\Custom folder.ini" прописать путь к другой папке.
;Путь прописывать без ковычек и прочего, просто C:\folder\folder2\ Работает только, если такая папка уже существует, иначе качает на рабочий стол (где ему самое место, мне кажется, а то потеряют ещё).
	inipath = %fldr%Custom folder.ini
	FileReadLine, customfldr, %inipath%, 1
	If FileExist(customfldr)
		UrlDownloadToFile, %fsemlink%, %customfldr%\ФСЭМ.docx
	else
	{
		If !FileExist(USERPROFILE "\Desktop\ФСЭМ\")
			FileCreateDir, %USERPROFILE%\Desktop\ФСЭМ\
		UrlDownloadToFile, %fsemlink%, %USERPROFILE%\Desktop\ФСЭМ\ФСЭМ.docx
	}
}