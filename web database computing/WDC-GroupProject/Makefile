.SILENT:push
.SILENT:install
install:

	npm -f update
	npm -f install
	npm -f update
	npm audit --fix -f

push:

	git add -A
	echo Enter commit message:
	read msg
	echo "Notice: you may require enter github username and password to authenticate with Github (Replace password with your personal access token)"
	git commit -m $msg
	git push origin master

#Manually starting and stop not recommend if using vscode
start:
	npm start
stop:
	npm stop