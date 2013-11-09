@echo off
REM =====================================
REM    Closure Compiler CMD Script
REM
REM     - by yubo@taobao.com
REM     - 2009-11-10
REM =====================================
SETLOCAL ENABLEEXTENSIONS

echo.
echo Google Closure Compiler

REM �����ļ���׺��ֻѹ�� js
if "%~x1" NEQ ".js" (
    echo.
    echo **** ��ѡ�� JS �ļ�
    echo.
    goto End
)

REM ���Java����
if "%JAVA_HOME%" == "" goto NoJavaHome
if not exist "%JAVA_HOME%\bin\java.exe" goto NoJavaHome
if not exist "%JAVA_HOME%\bin\native2ascii.exe" goto NoJavaHome

REM ����ѹ������ļ���������Ϊ��
REM 1. �ļ�����.sourceʱ: filename.source.js -> filename.js
REM 2. ���������filename.js -> filename-min.js
set RESULT_FILE=%~n1-min%~x1
dir /b "%~f1" | find ".source." > nul
if %ERRORLEVEL% == 0 (
    for %%a in ("%~n1") do (
        set RESULT_FILE=%%~na%~x1
    )
)

REM compile.jar
"%JAVA_HOME%\bin\java.exe" -jar "%~dp0compiler.jar"  --charset GB18030 --js "%~nx1" --js_output_file "%RESULT_FILE%"

REM �������������⣺�� js �ļ��ı�����ҳ����벻һ��ʱ���� ascii �ַ��ᵼ�����룬����취�ǣ�
REM 1. ���ȵ��� native2ascii.exe ���� ascii �ַ�ת��Ϊ \uxxxx ����
copy /y "%RESULT_FILE%" "%RESULT_FILE%.tmp" > nul
"%JAVA_HOME%\bin\native2ascii.exe" -encoding GB18030 "%RESULT_FILE%.tmp" "%RESULT_FILE%"
del /q "%RESULT_FILE%.tmp"
REM 2. ���� css �ļ�������Ҫ�� \uxxxx �е� u ȥ����css ֻ��ʶ\xxxx��
if "%~x1" == ".css" (
    "%~dp0fr.exe" "%RESULT_FILE%" -f:\u -t:\
)

REM print result
if %ERRORLEVEL% == 0 (
    echo.
    echo ѹ���ļ� %~nx1 �� %RESULT_FILE%
    for %%a in ("%RESULT_FILE%") do (
        echo �ļ���С�� %~z1 bytes ѹ���� %%~za bytes
    )
    echo.
) else (
    echo.
    echo **** �ļ� %~nx1 ����д����������ϸ���
    echo.
	goto End
)
goto End

:NoJavaHome
echo.
echo **** ���Ȱ�װ JDK ������ JAVA_HOME ��������
echo.

:End
ENDLOCAL
pause
