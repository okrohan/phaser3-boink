echo 'Deploying[1/4]: Building...'
yarn && yarn build
echo 'Deploying[2/4]: Remove prev build...'
rm -rf ../oknagisa.github.io/boink/*
echo 'Deploying[3/4]: Copying new build...'
cp ./dist/* ../oknagisa.github.io/boink -f -r
echo 'Deploying[4/4]: Commit to github'
cd ../oknagisa.github.io && git add . && git commit -m "Script: Updated boink build" && git push origin HEAD
echo 'Done!'
