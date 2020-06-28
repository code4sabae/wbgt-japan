while :
do
  node update.mjs
  git add .
  git commit -m 'update data'
  git push
  sleep 300
done
