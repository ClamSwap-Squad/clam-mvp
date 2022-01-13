# Rename all *.txt to *.text
for f in $(find . -name "*.js"); do 
    mv -- "$f" "${f%.js}.jsx"
done
