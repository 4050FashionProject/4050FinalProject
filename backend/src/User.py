class User:
	def __init__(self, username: str, display_name: str, email: str, password: str):
		# Check if username exists in db
		# Check if email exists in db
		self.username = username
		self.display_name = display_name
		self.email = email
		self.password = password
		self.followed_users = []
		self.closet = []
