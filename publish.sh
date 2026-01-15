#!/bin/bash
# Run these commands from the project root to publish to the provided GitHub repo

echo "# -https-contentwarrior.cm" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/dangminhquang081106-jpg/-https-contentwarrior.cm.git
git push -u origin main

# After pushing, remember to enable Pages and add your custom domain in GitHub repo settings.
