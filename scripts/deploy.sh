dirty=""

if [[ $(git diff --stat) != '' ]]; then
  echo 'dirty'
  dirty="true"
else
  echo 'clean'
  dirty="false"
fi

if [ "$dirty" = "true" ] ; then
  git stash -u
fi

git checkout master
git remote update -p
git merge --ff-only origin/master
git checkout -
git checkout production
git pull origin production
git rebase master
git push origin production
git checkout -

if [ "$dirty" = "true" ] ; then
  git stash pop
fi