Option Explicit

' Starts the local Hotel Polaris web server (if it is not running yet)
' and opens the bilingual website in the default browser.
'
' Usage: wscript.exe "Start Hotel Polaris.vbs" [path]
'   path defaults to "/" (Russian homepage); use "/en/" for English.

Dim sh, fso, base, python, pathArg, url, i
Set sh = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

base = fso.GetParentFolderName(WScript.ScriptFullName)
python = "C:\Users\Chamomile\AppData\Local\Programs\Python\Python312\python.exe"

pathArg = "/"
If WScript.Arguments.Count > 0 Then pathArg = WScript.Arguments(0)

If Not ServerIsUp() Then
    sh.CurrentDirectory = base
    sh.Run """" & python & """ -m http.server 8000 --bind 127.0.0.1", 0, False
    For i = 1 To 40
        WScript.Sleep 250
        If ServerIsUp() Then Exit For
    Next
End If

url = "http://127.0.0.1:8000" & pathArg
sh.Run url, 1, False

Function ServerIsUp()
    Dim req
    On Error Resume Next
    Set req = CreateObject("MSXML2.XMLHTTP")
    req.Open "GET", "http://127.0.0.1:8000/", False
    req.Send
    ServerIsUp = (Err.Number = 0 And req.Status = 200)
    On Error GoTo 0
End Function
