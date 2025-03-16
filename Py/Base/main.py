from PyQt5.QtWidgets import QApplication, QMainWindow, QListWidget
from PyQt5 import uic
import sys

def BaseA_10(a, b):
    s = 0
    p = 1
    for i in range(len(a) - 1, -1, -1):
        if "0" <= a[i] <= "9":
            s += int(a[i]) * p
        elif "A" <= a[i].upper() <= "F":
            s += (ord(a[i].upper()) - 55) * p
        else:
            return "0"
        p *= b
    return s

def Base10_A(a, b):
    ch = ""
    while a != 0:
        r = a % b
        if r < 10:
            ch = str(r) + ch
        else:
            ch = chr(r + 55) + ch
        a //= b
    return ch if ch else "0"    
     
def BaseA_B(a, b, a_base):
    if a_base == b:
        return a
    elif b == "10":
        return str(BaseA_10(a, int(a_base)))
    else:
        a_decimal = BaseA_10(a, int(a_base))
        return Base10_A(a_decimal, int(b))
        
def Base(a):
    i = a.find("(") + 1
    return a[i:a.find(")")]

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        uic.loadUi("Base_A_a_Base_B.ui", self)
        
        self.Convertir.clicked.connect(self.Convert)
        self.Permuter.clicked.connect(self.Permut)
        self.Effacer.clicked.connect(self.Efface)
        self.Sauvfile.clicked.connect(self.sauvgfichier)
        self.Clear.clicked.connect(self.EffaceList)
        self.history_widget = self.findChild(QListWidget, "historyList")

    
    def Convert(self):
        A = Base(self.Base_A.currentText())
        B = Base(self.Base_B.currentText())
        
        a = self.inp1.text()
        neg = False
        if a not in ["0",""]:
            if a[0] == "-":
                neg = True
                a = a[1:]
            
        b = BaseA_B(a, B, A)
        if neg:
            b = "-" + b
            a = "-" + a
        self.inp2.setText(b)
        
        if b not in ["0",""]:
            sauv = f"{a} ({A}) → {b} ({B})"
            self.history_widget.addItem(sauv)
        
    def Permut(self):
        A = self.Base_A.currentText()
        B = self.Base_B.currentText()
        self.Base_B.setCurrentText(A)
        self.Base_A.setCurrentText(B)
        
        a = self.inp1.text()
        b = self.inp2.text()
        self.inp1.setText(b)
        self.inp2.setText(a)
    
    def Efface(self):
        self.inp1.setText("")
        self.inp2.setText("")
        
    def sauvgfichier(self):
        with open("Convertission.txt", "w", encoding="utf-8") as f:
            for i in range(self.history_widget.count()):
                f.write(self.history_widget.item(i).text() + "\n")
    
    def EffaceList(self):
        self.history_widget.clear()

        
if __name__ == "__main__":
    
    app = QApplication([])
    window = MainWindow()
    window.show()
    sys.exit(app.exec_())