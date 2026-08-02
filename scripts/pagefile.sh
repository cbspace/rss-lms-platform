# Show current state
swapon --show
free- h

# 1. Create a 2G swap file
sudo fallocate -l 2G /swapfile

# 2. Set the correct permissions
sudo chmod 600 /swapfile

# 3. Format the file as swap space
sudo mkswap /swapfile

# 4. Enable the swap file
sudo swapon /swapfile

# 5. Verify it’s active
swapon --show

# to make it permanent after reboot
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

#check free and page memory
free -h
