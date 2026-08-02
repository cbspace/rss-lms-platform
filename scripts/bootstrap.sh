# Install GIT
sudo yum install git -y
git -v

# Clone the repo
git config --global user.name "cbspace"
git config --global user.email "24204459+cbspace@users.noreply.github.com"
git clone https://github.com/cbspace/rss-lms-platform.git

# Install make
sudo yum install make -y

# Navigate to base folder
cd rss-lms-platform

# "Download more RAM"
echo "Setting up swap file"
./scripts/pagefile.sh

echo "You have been bootstrapped, now run:"
echo "make setup"
