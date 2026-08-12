# Install GIT
sudo yum install git -y
git -v

# Clone the repo and setup GIT credentials
# Add your credentials and uncomment lines
# git config --global user.name "my_name"
# git config --global user.email "my_email"
git clone https://github.com/cbspace/rss-lms-platform.git

# Install make
sudo yum install make -y

# Navigate to base folder
cd rss-lms-platform

# "Download more RAM"
echo "Setting up swap file"
./scripts/pagefile.sh

echo "--- You have been bootstrapped, now run \"make setup\" then \"make prod\" to deploy! ---"
