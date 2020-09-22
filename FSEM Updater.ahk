#SingleInstance, Force
#NoTrayIcon

ComObjError(false)
whr := ComObjCreate("WinHttp.WinHttpRequest.5.1")
;���� ������ �� docx �� ����� ������� (���� ��� ��������� �� �����, ���������� ����� ��� ������������ �����, � �� ������� ���)
whr.Open("GET", "https://github.com/barbaduk/SomeRandomStuff/raw/master/FSEM-link", true)
whr.Send()
whr.WaitForResponse()
fsemlink := StrReplace(whr.ResponseText, "`n")
whr.Open("GET", fsemlink)
whr.Send()
whr.WaitForResponse()
checkfile := whr.ResponseText
;�������� ������ ����� �������. ���� ����� �� ������ ���, �� � ����� ����� ������, ���������� "html".
IfNotInString, checkfile, html
{
;�������� ��� ���� � ����� "C:\users\public\FSEM Updater\" (���� ���� � ����� ��� ����������, �� ��������������� �������� ������������).
;��� �����, ����� ����������� �� �������� �� ��� ����, ������� ��� ���������� ������� (����� ��� ������), � ��� ����� ������ � ������ "����������".
;����� ���� ������, ������ ��� ��� ����������� �� ����� ����� �������������� + ������������ ���� ���� �� �������.
	fldr = %public%\FSEM Updater\
	If !FileExist(fldr)
		FileCreateDir, %fldr%
	If !FileExist(fldr A_ScriptName)
		FileCopy, %A_ScriptFullPath%, %fldr%
	If !FileExist(fldr "Custom folder.ini")
		FileAppend, , %fldr%Custom folder.ini
;���� � ������������ ��� ������ � ������ "FSEM Updater", �� ������ � (��������������, ������������ ������ ��� ������ �������)
	RunWait, %A_WinDir%\System32\schtasks.exe /TN "FSEM Updater", , UseErrorLevel
	if ErrorLevel
		Run, powershell -Command "$t = New-ScheduledTaskTrigger -Weekly -DaysOfWeek Tue -At "13:00" -WeeksInterval 2;$o = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -WakeToRun;$a = New-ScheduledTaskAction -Execute "'%fldr%%A_ScriptName%'";Register-ScheduledTask -TaskName 'FSEM Updater' -Trigger $t -Settings $o -Action $a", , hide
;���������� ���� ����������. ��� �� ���� ������� ���������� �� �� ������� ����, ���� � ����� "...\FSEM Updater\Custom folder.ini" ��������� ���� � ������ �����.
;���� ����������� ��� ������� � �������, ������ C:\folder\folder2\ �������� ������, ���� ����� ����� ��� ����������, ����� ������ �� ������� ���� (��� ��� ����� �����, ��� �������, � �� �������� ���).
	inipath = %fldr%Custom folder.ini
	FileReadLine, customfldr, %inipath%, 1
	If FileExist(customfldr)
		UrlDownloadToFile, %fsemlink%, %customfldr%\����.docx
	else
	{
		If !FileExist(USERPROFILE "\Desktop\����\")
			FileCreateDir, %USERPROFILE%\Desktop\����\
		UrlDownloadToFile, %fsemlink%, %USERPROFILE%\Desktop\����\����.docx
	}
}