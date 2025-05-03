import tkinter as tk
from tkinter import ttk

class DarkThemeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Dark Theme Example")
        
        # Set dark theme colors
        self.bg_color = "#2b2b2b"  # Dark background
        self.fg_color = "#ffffff"  # White text
        self.accent_color = "#3c3f41"  # Slightly lighter background for widgets
        
        # Configure root window
        self.root.configure(bg=self.bg_color)
        
        # Create main frame
        self.main_frame = ttk.Frame(self.root, padding="20")
        self.main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Create widgets
        self.create_widgets()
        
    def create_widgets(self):
        # Style configuration
        style = ttk.Style()
        style.configure("Dark.TLabel", 
                       background=self.bg_color,
                       foreground=self.fg_color)
        style.configure("Dark.TButton",
                       background=self.accent_color,
                       foreground=self.fg_color)
        style.configure("Dark.TFrame",
                       background=self.bg_color)
        
        # Title label
        title_label = ttk.Label(self.main_frame, 
                              text="Dark Theme Example",
                              style="Dark.TLabel",
                              font=("Arial", 16, "bold"))
        title_label.pack(pady=10)
        
        # Categories frame
        categories_frame = ttk.Frame(self.main_frame, style="Dark.TFrame")
        categories_frame.pack(fill=tk.X, pady=10)
        
        # Category labels
        categories = ["Category 1", "Category 2", "Category 3", "Category 4"]
        for category in categories:
            category_label = ttk.Label(categories_frame,
                                     text=category,
                                     style="Dark.TLabel",
                                     padding=10)
            category_label.pack(side=tk.LEFT, padx=5)
            
            # Add a separator
            if category != categories[-1]:
                separator = ttk.Separator(categories_frame, orient=tk.VERTICAL)
                separator.pack(side=tk.LEFT, fill=tk.Y, padx=5)
        
        # Content area
        content_frame = ttk.Frame(self.main_frame, style="Dark.TFrame")
        content_frame.pack(fill=tk.BOTH, expand=True, pady=20)
        
        # Sample content
        content_text = "This is a sample content area with dark theme.\n" \
                      "The background is dark and text is light for better contrast."
        content_label = ttk.Label(content_frame,
                                text=content_text,
                                style="Dark.TLabel",
                                wraplength=400)
        content_label.pack(pady=20)
        
        # Buttons
        button_frame = ttk.Frame(self.main_frame, style="Dark.TFrame")
        button_frame.pack(fill=tk.X, pady=10)
        
        ttk.Button(button_frame,
                  text="Button 1",
                  style="Dark.TButton").pack(side=tk.LEFT, padx=5)
        ttk.Button(button_frame,
                  text="Button 2",
                  style="Dark.TButton").pack(side=tk.LEFT, padx=5)

def main():
    root = tk.Tk()
    app = DarkThemeApp(root)
    root.mainloop()

if __name__ == "__main__":
    main() 