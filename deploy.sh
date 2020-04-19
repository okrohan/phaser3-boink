echo 'Deploying[1/4]: Building...'
yarn build
echo 'Deploying[2/4]: Remove prev build...'
rm -rf ../okrohan.github.io/bounce/*
echo 'Deploying[3/4]: Copying new build...'
cp ./dist/* ../okrohan.github.io/bounce -f -r
echo 'Deploying[4/4]: Commit to github'
cd ../okrohan.github.io && git add . && git commit -m "Script: Updated bounce build" 
echo 'Done!'
